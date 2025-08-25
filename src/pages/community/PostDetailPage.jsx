// src/pages/community/PostDetailPage.jsx
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';
import api, { getToken } from '../../lib/api';

/* ============================
 * 유틸 (이전과 동일)
 * ============================ */
function parseJwt(token) { try { const payload = token.split('.')[1]; const b64 = payload.replace(/-/g, '+').replace(/_/g, '/'); const pad = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '='); const json = atob(pad); const uri = Array.from(json).map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); return JSON.parse(decodeURIComponent(uri)); } catch { return null; } }
const avatarOf = (name = 'U', size = 40) => `https://placehold.co/${size}x${size}/E5E7EB/111?text=${encodeURIComponent((name || 'U')[0])}`;
const CATEGORY_LABEL = { QUESTION: '질문', FREE: '자유', TIP: '팁', NOTICE: '공지', MARKET: '중고나눔' };
const isHtmlContent = (str) => /<\/?[a-z][\s\S]*>/i.test(String(str ?? '').trim());
const extractAuthorId = (obj = {}) => obj.authorId ?? obj.userId ?? obj.writerId ?? obj.createdById ?? obj.author?.id ?? obj.user?.id ?? obj.writer?.id ?? obj.createdBy?.id ?? obj.user_id ?? null;
const getViewCount = (p) => p.viewCount ?? p.views ?? p.view_count ?? p.hit ?? p.readCount ?? 0;

/* ============================
 * Normalizers (이전과 동일)
 * ============================ */
function normalizePost(p) {
  const created = p.createdAt || p.created_at || p.createdDate || p.date || p.created;
  return {
    id: p.id ?? p.postId,
    rawCategory: p.category, 
    category: CATEGORY_LABEL[p.category] || p.category || '자유',
    title: p.title ?? '(제목 없음)',
    author: p.author?.nickname || p.author?.name || p.authorName || p.user?.nickname || p.user?.name || p.username || null,
    authorId: extractAuthorId(p),
    authorAvatar: p.author?.avatarUrl || p.authorAvatar || null,
    date: created ? new Date(created).toLocaleDateString('ko-KR') : '-',
    views: getViewCount(p),
    content: p.contentHtml ?? p.content ?? p.body ?? '',
  };
}
function normalizeComment(c) {
  const d = c.createdAt || c.date;
  return {
    id: c.id ?? c.commentId,
    author: c.author?.nickname || c.author?.name || c.authorName || c.user?.nickname || c.user?.name || c.username || null,
    authorId: extractAuthorId(c),
    avatar: c.author?.avatarUrl || c.avatar || null,
    date: d ? new Date(d).toLocaleDateString('ko-KR') : '-',
    content: c.contentHtml ?? c.content ?? c.body ?? '',
    isAccepted: c.isAccepted ?? c.accepted ?? false,
  };
}

/* ============================
 * Component
 * ============================ */
export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState(null); // --- 에러 상태 추가
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleChangeTab = useCallback((next) => navigate('/', { state: { tab: next } }), [navigate]);
  const handleCalendarClick = useCallback(() => navigate('/calendar'), [navigate]);
  
  const isAnyCommentAccepted = useMemo(() => comments.some(c => c.isAccepted), [comments]);

  const fetchPost = useCallback(async () => {
    // ✅ fetch 함수 시작 시 postId 유효성 검사
    if (!postId) {
      setError('유효하지 않은 게시글 ID입니다.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/api/community/posts/${postId}`);
      if (!res?.data) return setError('게시글을 찾을 수 없습니다.');
      const normalized = normalizePost(res.data);
      setPost(normalized);
      const vc = normalized.views;
      if (vc != null) sessionStorage.setItem(`viewCount_${postId}`, String(vc));
    } catch (err) {
      if (err?.response?.status === 404) setError('게시글을 찾을 수 없습니다.');
      else console.error('게시글 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    if (!postId) return; // postId 없으면 실행 안함
    try {
      setCommentsLoading(true);
      const res = await api.get(`/api/community/posts/${postId}/comments`);
      const list = Array.isArray(res.data) ? res.data : (res.data?.content ?? res.data?.items ?? []);
      setComments(list ? list.map(normalizeComment) : []);
    } catch (err) {
      console.error('댓글 목록 불러오기 실패:', err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);
  
  useEffect(() => { fetchPost(); }, [fetchPost]);
  useEffect(() => { fetchComments(); }, [fetchComments]);

  useEffect(() => { const token = getToken(); if (!token) return; const payload = parseJwt(token); if (!payload) return; const uid = payload.id ?? payload.userId ?? payload.uid ?? payload.sub ?? null; const name = payload.name ?? payload.username ?? payload.sub ?? '사용자'; if (uid != null) setCurrentUser({ id: uid, name }); }, []);
  useEffect(() => { const ids = new Set(); if (post?.authorId != null) ids.add(String(post.authorId)); for (const c of comments) if (c.authorId != null) ids.add(String(c.authorId)); const missing = Array.from(ids).filter((id) => !userMap[id]); if (missing.length === 0) return; let alive = true; (async () => { try { const results = await Promise.allSettled( missing.map((id) => api.get(`/api/auth/users/${id}`)) ); if (!alive) return; const next = { ...userMap }; results.forEach((r) => { if (r.status === 'fulfilled') { const u = r.value.data; if (u?.id != null) next[String(u.id)] = u; } }); setUserMap(next); } catch (e) { console.error('작성자 정보 조회 실패:', e); } })(); return () => { alive = false; }; }, [post, comments]);
  
  const submitComment = async () => { /* 이전과 동일 */ const token = getToken(); if (!token) return alert('로그인이 필요합니다.'); const text = commentText.trim(); if (!text) return; try { setSending(true); await api.post(`/api/community/posts/${postId}/comments`, { content: text, parentId: null, }); setCommentText(''); await fetchComments(); } catch (err) { console.error('댓글 등록 실패:', err); const status = err?.response?.status; if (status === 401) alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.'); else alert('댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'); } finally { setSending(false); } };
  const canDeleteComment = (c) => !!currentUser && c?.authorId != null && String(currentUser.id) === String(c.authorId);
  const deleteComment = async (commentId) => { /* 이전과 동일 */ if (!window.confirm('이 댓글을 삭제할까요?')) return; const apiUrl = `/api/community/posts/${postId}/comments/${commentId}`; try { await api.delete(apiUrl); alert('댓글이 삭제되었습니다.'); setComments(prevComments => prevComments.filter(c => c.id !== commentId)); setOpenMenuId(null); } catch (err) { console.error('댓글 삭제 실패:', err); const status = err?.response?.status; if (status === 401 || status === 403) { alert('삭제 권한이 없습니다.'); } else { alert('댓글 삭제에 실패했습니다.'); } } };
  useEffect(() => { const close = () => setOpenMenuId(null); document.addEventListener('click', close); return () => document.removeEventListener('click', close); }, []);
  const handleEdit = () => navigate(`/community/edit/${postId}`);
  const handleDelete = async () => { if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return; try { await api.delete(`/api/community/posts/${postId}`); alert('게시글이 삭제되었습니다.'); navigate('/', { state: { tab: '커뮤니티' } }); } catch (err) { console.error('게시글 삭제 실패:', err); alert('게시글 삭제에 실패했습니다.'); } };
  const onCommentKeyDown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (!sending) submitComment(); } };

  // --- ✅ 댓글 채택 함수 (방어 코드 및 디버깅 로그 추가) ---
  const handleAcceptComment = async (commentId) => {
    // 1. postId가 유효한지 먼저 확인
    if (!postId) {
      console.error("오류: postId가 존재하지 않아 채택을 진행할 수 없습니다.");
      alert("오류가 발생했습니다. 페이지를 새로고침 해주세요.");
      return;
    }
    
    if (!window.confirm('이 답변을 채택하시겠습니까? 채택 후에는 변경할 수 없습니다.')) return;

    const apiUrl = `/api/community/posts/${postId}/comments/${commentId}/accept`;

    // 2. API 호출 직전, 실제 값들을 콘솔에 출력하여 확인
    console.log("--- 채택 버튼 클릭됨 ---");
    console.log("현재 postId 값:", postId);
    console.log("현재 commentId 값:", commentId);
    console.log("만들어진 최종 요청 URL:", apiUrl);

    try {
      await api.post(apiUrl);
      alert('답변이 채택되었습니다.');
      await fetchComments();
    } catch (err) {
      console.error('댓글 채택 실패:', err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        alert('채택 권한이 없습니다.');
      } else if (status === 404) {
        alert('API 경로를 찾을 수 없습니다. (404)');
      } else {
        alert('댓글 채택에 실패했습니다.');
      }
    }
  };
  
  /* ============================
   * 렌더
   * ============================ */
  
  // 로딩 및 에러 상태를 먼저 처리
  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-8">게시글 불러오는 중...</div>;
    }

    if (error || !post) {
      return (
        <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-8">
          <p className="text-center text-gray-500">{error || '게시글을 찾을 수 없습니다.'}</p>
          <div className="text-center mt-4">
            <Link to="/" state={{ tab: '커뮤니티' }} className="text-blue-500 hover:underline">목록으로 돌아가기</Link>
          </div>
        </div>
      );
    }
    
    // 정상적인 경우 게시글 내용 렌더링
    const displayAuthor = (post.authorId != null && (userMap[String(post.authorId)]?.name || userMap[String(post.authorId)]?.username)) || post.author || '익명';
    const isLoggedIn = !!getToken();
    const isAuthor = !!currentUser && !!post && String(currentUser.id) === String(post.authorId);

    return (
      <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-10">
        <p className="text-sm mb-2"><Link to="/" state={{ tab: '커뮤니티' }} className="font-semibold hover:underline" style={{ color: '#FEAA45' }}>{post.category} &gt;</Link></p>
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3"><img src={post.authorAvatar || avatarOf(displayAuthor, 40)} alt="author avatar" className="w-10 h-10 rounded-full object-cover" /><div className="leading-tight"><div className="font-semibold text-gray-900">{displayAuthor}</div><div className="text-xs text-gray-400 mt-1">{post.date}<span className="mx-2">·</span>조회 {Number(post.views).toLocaleString('ko-KR')}</div></div></div>
          {isAuthor && (<div className="flex items-center gap-2"><button onClick={handleEdit} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">수정</button><button onClick={handleDelete} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">삭제</button></div>)}
        </div>
        <div className="h-[0.5px] bg-[#E2E8F0] my-2" role="separator" aria-hidden="true" />
        {isHtmlContent(post.content) ? <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} /> : <div className="text-gray-800 whitespace-pre-wrap">{post.content}</div>}

        {!commentsLoading && comments.length > 0 && (
          <div className="comments-section mt-10 space-y-6">
            {comments.map((c) => {
              const u = c.authorId != null ? userMap[String(c.authorId)] : undefined;
              const name = u?.name || u?.username || c.author || '익명';
              const html = isHtmlContent(c.content);
              const isCommentMine = canDeleteComment(c);
              const canBeAccepted = post.rawCategory === 'QUESTION' && isAuthor && !isCommentMine && !c.isAccepted && !isAnyCommentAccepted;

              return (
                <div key={c.id} className={`pt-2 relative ${c.isAccepted ? 'bg-green-50 p-4 rounded-lg -m-4' : ''}`}>
                  <div className="flex items-start gap-3 mb-2">
                    <img src={c.avatar || avatarOf(name, 32)} alt="comment avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-gray-800">{name}</div>
                            {c.isAccepted && (<span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full">✔ 채택된 답변</span>)}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{c.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {canBeAccepted && (<button onClick={() => handleAcceptComment(c.id)} className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">채택하기</button>)}
                          {isCommentMine && (
                            <div className="relative select-none">
                              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setOpenMenuId((prev) => (prev === c.id ? null : c.id)); }} title="더보기"><span className="text-xl leading-none">⋮</span></button>
                              {openMenuId === c.id && (<div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10" onClick={(e) => e.stopPropagation()}><button onClick={() => deleteComment(c.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">삭제</button></div>)}
                            </div>
                          )}
                        </div>
                      </div>
                      {html ? <div className="text-gray-700 text-sm mt-2" dangerouslySetInnerHTML={{ __html: c.content }} /> : <div className="text-gray-700 text-sm whitespace-pre-wrap mt-2">{c.content}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 border border-gray-200 rounded-xl bg-white p-4"><div className="flex items-center justify-between mb-2"><div className="font-semibold">댓글 작성</div>{!isLoggedIn && (<Link to="/login" className="text-sm text-blue-600 hover:underline">로그인 후 댓글 작성 가능</Link>)}</div><textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={onCommentKeyDown} className="w-full h-16 md:h-20 max-h-40 overflow-y-auto p-3 rounded-md bg-transparent border border-gray-200 outline-none focus:ring-0 resize-none" placeholder="댓글을 남겨보세요 (5 온정 적립)" rows={2} disabled={!isLoggedIn || sending} /><div className="flex justify-end mt-2"><button onClick={submitComment} disabled={sending || !commentText.trim() || !isLoggedIn} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed">{sending ? '등록 중...' : '등록'}</button></div></div>
      </div>
    );
  };
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <TopBar activeTab="커뮤니티" onChangeTab={handleChangeTab} onCalendarClick={handleCalendarClick} />
      <main className="flex-1 flex flex-col min-h-0">
        <div className="w-full min-w-[800px] max-w-5xl md:max-w-6xl mx-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
      <BottomFooter />
    </div>
  );
}