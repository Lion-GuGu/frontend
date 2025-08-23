// src/pages/community/PostDetailPage.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';
import api, { getToken } from '../../lib/api';

// ---- utils ----
const avatarOf = (name = 'U', size = 40) =>
  `https://placehold.co/${size}x${size}/E5E7EB/111?text=${encodeURIComponent((name || 'U')[0])}`;

const CATEGORY_LABEL = {
  QUESTION: '질문',
  FREE: '자유',
  TIP: '팁',
  NOTICE: '공지',
  MARKET: '거래',
};

const isHtmlContent = (str) => /<\/?[a-z][\s\S]*>/i.test(String(str ?? '').trim());
const extractAuthorId = (obj = {}) =>
  obj.authorId ??
  obj.userId ??
  obj.writerId ??
  obj.createdById ??
  obj.author?.id ??
  obj.user?.id ??
  obj.writer?.id ??
  obj.createdBy?.id ??
  obj.user_id ??
  null;

// ---- normalizers ----
function normalizePost(p) {
  return {
    id: p.id ?? p.postId,
    category: CATEGORY_LABEL[p.category] || p.category || '자유',
    title: p.title ?? '(제목 없음)',
    author:
      p.author?.nickname ||
      p.author?.name ||
      p.authorName ||
      p.user?.nickname ||
      p.user?.name ||
      p.username ||
      null,
    authorId: extractAuthorId(p),
    authorAvatar: p.author?.avatarUrl || p.authorAvatar || null,
    date: (() => {
      const created = p.createdAt || p.created_at || p.createdDate || p.date || p.created;
      return created ? new Date(created).toLocaleDateString('ko-KR') : '-';
    })(),
    views: p.views ?? p.viewCount ?? p.hit ?? 0,
    content: p.contentHtml ?? p.content ?? p.body ?? '',
  };
}

function normalizeComment(c) {
  return {
    id: c.id ?? c.commentId,
    author:
      c.author?.nickname ||
      c.author?.name ||
      c.authorName ||
      c.user?.nickname ||
      c.user?.name ||
      c.username ||
      null,
    authorId: extractAuthorId(c),
    avatar: c.author?.avatarUrl || c.avatar || null,
    date: (() => {
      const d = c.createdAt || c.date;
      return d ? new Date(d).toLocaleDateString('ko-KR') : '-';
    })(),
    content: c.contentHtml ?? c.content ?? c.body ?? '',
  };
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // ✅ 댓글 목록은 별도 상태
  const [userMap, setUserMap] = useState({});   // { [id]: user }
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);

  const handleChangeTab = useCallback(
    (next) => navigate('/', { state: { tab: next } }),
    [navigate]
  );
  const handleCalendarClick = useCallback(() => navigate('/calendar'), [navigate]);

  // ---- fetchers ----
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/community/posts/${postId}`);
      if (!res?.data) return setNotFound(true);
      setPost(normalizePost(res.data));
    } catch (err) {
      // 폴백: 목록에서 찾기
      try {
        const list = await api.get('/api/community/posts', { params: { id: postId } });
        const data = Array.isArray(list.data)
          ? list.data.find((x) => String(x.id ?? x.postId) === String(postId))
          : list.data?.content?.find?.((x) => String(x.id ?? x.postId) === String(postId)) ??
            list.data;
        if (!data) return setNotFound(true);
        setPost(normalizePost(data));
      } catch (e2) {
        if (e2?.response?.status === 404) setNotFound(true);
        console.error('게시글 불러오기 실패:', e2);
      }
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      setCommentsLoading(true);
      // ✅ 기본: /api/community/posts/{postId}/comments 로 시도
      const res = await api.get(`/api/community/posts/${postId}/comments`);
      const list = Array.isArray(res.data)
        ? res.data
        : (res.data?.content ?? res.data?.items ?? []);
      if (list) {
        setComments(list.map(normalizeComment));
        return;
      }
      // 응답이 비정형이면 빈 목록로 둔다
      setComments([]);
    } catch (err) {
      // 서버에 GET 엔드포인트가 없다면 상세에 포함된 댓글을 폴백으로 사용
      try {
        const detail = await api.get(`/api/community/posts/${postId}`);
        const inner = (detail.data?.comments || []).map(normalizeComment);
        setComments(inner);
      } catch (e2) {
        console.error('댓글 목록 불러오기 실패:', e2);
        setComments([]); // 없으면 그냥 안 보여줌
      }
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);

  // 최초 로드
  useEffect(() => { fetchPost(); }, [fetchPost]);
  useEffect(() => { fetchComments(); }, [fetchComments]);

  // ✅ 작성자/댓글 작성자 유저 정보 불러오기 (있을 때만)
  useEffect(() => {
    const ids = new Set();
    if (post?.authorId != null) ids.add(String(post.authorId));
    for (const c of comments) if (c.authorId != null) ids.add(String(c.authorId));
    const missing = Array.from(ids).filter((id) => !userMap[id]);
    if (missing.length === 0) return;

    let alive = true;
    (async () => {
      try {
        const results = await Promise.allSettled(
          missing.map((id) => api.get(`/api/auth/users/${id}`))
        );
        if (!alive) return;
        const next = { ...userMap };
        results.forEach((r) => {
          if (r.status === 'fulfilled') {
            const u = r.value.data;
            if (u?.id != null) next[String(u.id)] = u;
          }
        });
        setUserMap(next);
      } catch (e) {
        console.error('작성자 정보 조회 실패:', e);
      }
    })();
    return () => { alive = false; };
  }, [post, comments]); // post/댓글 바뀔 때마다

  // ---- comment submit ----
  const submitComment = async () => {
    const token = getToken();
    if (!token) return alert('로그인이 필요합니다.');
    const text = commentText.trim();
    if (!text) return;
    try {
      setSending(true);
      await api.post(`/api/community/posts/${postId}/comments`, {
        content: text,
        parentId: null,
      });
      setCommentText('');
      await fetchComments(); // ✅ 등록 후 목록 갱신
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      const status = err?.response?.status;
      if (status === 401) alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.');
      else alert('댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSending(false);
    }
  };

  const onCommentKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!sending) submitComment();
    }
  };

  // ---- render ----
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
        <TopBar activeTab="커뮤니티" onChangeTab={handleChangeTab} onCalendarClick={handleCalendarClick} />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="max-w-4xl mx-auto p-8">게시글 불러오는 중...</div>
        </main>
        <BottomFooter />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
        <TopBar activeTab="커뮤니티" onChangeTab={handleChangeTab} onCalendarClick={handleCalendarClick} />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-8">
              <p className="text-center text-gray-500">게시글을 찾을 수 없습니다.</p>
              <div className="text-center mt-4">
                <Link to="/" state={{ tab: '커뮤니티' }} className="text-blue-500 hover:underline">목록으로 돌아가기</Link>
              </div>
            </div>
          </div>
        </main>
        <BottomFooter />
      </div>
    );
  }

  const displayAuthor =
    (post.authorId != null &&
      (userMap[String(post.authorId)]?.name || userMap[String(post.authorId)]?.username)) ||
    post.author ||
    '익명';

  const isLoggedIn = !!getToken();

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <TopBar activeTab="커뮤니티" onChangeTab={handleChangeTab} onCalendarClick={handleCalendarClick} />

      <main className="flex-1 flex flex-col min-h-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
            {/* 상단 */}
            <p className="text-sm mb-2">
              <Link to="/" state={{ tab: '커뮤니티' }} className="font-semibold hover:underline" style={{ color: '#FEAA45' }}>
                {post.category} &gt;
              </Link>
            </p>
            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>

            {/* 작성자 */}
            <div className="flex items-center gap-3 mb-2">
              <img src={post.authorAvatar || avatarOf(displayAuthor, 40)} alt="author avatar" className="w-10 h-10 rounded-full object-cover" />
              <div className="leading-tight">
                <div className="font-semibold text-gray-900">{displayAuthor}</div>
                <div className="text-xs text-gray-400 mt-1">{post.date}</div>
              </div>
            </div>

            <div className="h-[0.5px] bg-[#E2E8F0] my-2" role="separator" aria-hidden="true" />

            {/* 본문 */}
            {isHtmlContent(post.content) ? (
              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className="text-gray-800 whitespace-pre-wrap">{post.content}</div>
            )}

            {/* ✅ 댓글 목록: 있으면만 렌더 */}
            {!commentsLoading && comments.length > 0 && (
              <div className="comments-section mt-10 space-y-6">
                {comments.map((c) => {
                  const u = c.authorId != null ? userMap[String(c.authorId)] : undefined;
                  const name = u?.name || u?.username || c.author || '익명';
                  const html = isHtmlContent(c.content);
                  return (
                    <div key={c.id} className="pt-2">
                      <div className="flex items-start gap-3 mb-2">
                        <img src={c.avatar || avatarOf(name, 32)} alt="comment avatar" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-gray-800">{name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{c.date}</div>
                        </div>
                      </div>
                      {html ? (
                        <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: c.content }} />
                      ) : (
                        <div className="text-gray-700 text-sm whitespace-pre-wrap">{c.content}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 댓글 입력 */}
            <div className="mt-6 border border-gray-200 rounded-xl bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">댓글 작성</div>
                {!isLoggedIn && (
                  <Link to="/login" className="text-sm text-blue-600 hover:underline">
                    로그인 후 댓글 작성 가능
                  </Link>
                )}
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (!sending) submitComment();
                  }
                }}
                className="w-full h-16 md:h-20 max-h-40 overflow-y-auto p-3 rounded-md bg-transparent border border-gray-200 outline-none focus:ring-0 resize-none"
                placeholder="댓글을 남겨보세요 (Ctrl/⌘ + Enter 등록)"
                rows={2}
                disabled={!isLoggedIn || sending}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={submitComment}
                  disabled={sending || !commentText.trim() || !isLoggedIn}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? '등록 중...' : '등록'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}
