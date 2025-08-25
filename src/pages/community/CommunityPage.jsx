// src/pages/community/CommunityPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api, { getToken } from '../../lib/api';
import BoardControls from '../../component/community/BoardControls';
import PostTable from '../../component/community/PostTable';
import PaginationAndSearch from '../../component/community/PaginationAndSearch';

const KOR2ENUM = { '자유': 'FREE', '질문': 'QUESTION', '중고나눔': 'MARKET' };

function extractAuthorId(p) { return p.authorId ?? p.userId ?? p.writerId ?? p.createdById ?? p.author?.id ?? p.user?.id ?? p.writer?.id ?? p.createdBy?.id ?? p.user_id ?? null; }
function getPostId(p) { return p.id ?? p.postId ?? p.postID ?? p.boardId ?? null; }
function extractViewCount(p) { return p.viewCount ?? p.views ?? p.view_count ?? p.hit ?? p.readCount ?? null; }
function extractCommentCount(p) { return p.commentCount ?? p.commentsCount ?? p.replyCount ?? p.repliesCount ?? p.comment_count ?? 0; }

// ===== 추천 돌봄 카드 =====
function RecCard({ rec }) {
  const name = rec?.name ?? rec?.username ?? '이용자';
  const username = rec?.username ? `@${rec.username}` : '';
  const area = rec?.childResidence ?? rec?.residence ?? rec?.region ?? '-';

  return (
    <div className="rounded-2xl bg-white shadow-sm p-4 border border-gray-100 flex flex-col gap-1">
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-sm text-gray-500">{username}</div>
      <div className="mt-2 text-sm">
        <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          활동지역: {area}
        </span>
      </div>
      {/* 필요 시 프로필/신청 이동 버튼 자리 */}
      {/* <button className="mt-3 text-sm font-medium underline">프로필 보기</button> */}
    </div>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [viewMap, setViewMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);
  const [categoryKor, setCategoryKor] = useState('전체');

  // --- 추천 돌봄 상태 ---
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState('');

  // --- 페이지네이션 & 검색 상태 관리 ---
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0 });
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 입력값 (실시간)
  const [submittedSearch, setSubmittedSearch] = useState(''); // 실제 API 요청에 사용할 검색어
  const size = 10;
  // ------------------------------------

  const categoryEnum = useMemo(
    () => (categoryKor === '전체' ? undefined : KOR2ENUM[categoryKor]),
    [categoryKor]
  );

  // ===== A) 오늘의 추천 돌봄 불러오기 =====
  useEffect(() => {
    const token = getToken();
    if (!token) return; // 비로그인 시 표시 안 함

    // 우선순위: URL ?requestId= → localStorage.current_request_id
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('requestId');
    const fromStorage = localStorage.getItem('current_request_id');
    const requestId = fromUrl ?? fromStorage;

    if (!requestId) {
      setRecs([]);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setRecsLoading(true);
        setRecsError('');
        const { data } = await api.get(`/api/requests/${requestId}/recommendations`);
        // 배열 또는 래핑된 형태 모두 대응
        const list = Array.isArray(data)
          ? data
          : (data?.content ?? data?.items ?? data?.recommendations ?? []);
        if (alive) setRecs(Array.isArray(list) ? list : []);
      } catch (e) {
        if (alive) {
          setRecs([]);
          setRecsError('추천 목록을 불러오지 못했어요.');
          console.error('추천 돌봄 조회 실패:', e);
        }
      } finally {
        if (alive) setRecsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ===== B) 글 목록 (페이지/검색어 변경 시 재조회) =====
  useEffect(() => {
    const t = getToken();
    if (!t) {
      setNeedLogin(true);
      setPosts([]);
      setLoading(false);
      return;
    }
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const params = {
          page,
          size,
          ...(categoryEnum ? { category: categoryEnum } : {}),
          ...(submittedSearch ? { q: submittedSearch } : {}),
        };
        const { data } = await api.get('/api/community/posts', { params });
        const items = Array.isArray(data) ? data : (data?.content ?? data?.items ?? data?.posts ?? []);
        const totalPages = data?.totalPages ?? 0;
        const totalElements = data?.totalElements ?? 0;

        if (alive) {
          setPosts(items || []);
          setPageInfo({ totalPages, totalElements });
          setViewMap({});
        }
      } catch (err) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setNeedLogin(true);
          setPosts([]);
        } else {
          console.error('게시글 불러오기 실패:', err);
          setPosts([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [categoryEnum, page, size, submittedSearch]);

  // ===== C) 작성자 정보 조회 =====
  useEffect(() => {
    let alive = true;
    (async () => {
      const ids = Array.from(new Set(posts.map(extractAuthorId).filter(v => v != null)));
      const missing = ids.filter(id => !userMap[id]);
      if (missing.length === 0) return;
      try {
        const results = await Promise.allSettled(
          missing.map(id => api.get(`/api/auth/users/${id}`))
        );
        if (!alive) return;
        const next = { ...userMap };
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            const user = result.value.data;
            if (user.id != null) next[String(user.id)] = user;
          }
        });
        setUserMap(next);
      } catch (e) { console.error('작성자 정보 조회 실패:', e); }
    })();
    return () => { alive = false; };
  }, [posts, userMap]);

  // ===== D) 조회수 병합 =====
  useEffect(() => {
    const applyFromSession = () => {
      const idsInList = new Set(posts.map(getPostId).filter((id) => id != null).map(String));
      let changed = false;
      const next = { ...viewMap };
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (!key || !key.startsWith('viewCount_')) continue;
        const id = key.slice('viewCount_'.length);
        if (!idsInList.has(id)) continue;
        const val = Number(sessionStorage.getItem(key));
        if (Number.isFinite(val) && next[id] !== val) { next[id] = val; changed = true; }
      }
      Array.from(idsInList).forEach((id) => {
        const k = `viewCount_${id}`;
        if (sessionStorage.getItem(k) != null) sessionStorage.removeItem(k);
      });
      if (changed) setViewMap(next);
    };
    applyFromSession();
    const onShow = () => applyFromSession();
    window.addEventListener('pageshow', onShow);
    document.addEventListener('visibilitychange', onShow);
    return () => {
      window.removeEventListener('pageshow', onShow);
      document.removeEventListener('visibilitychange', onShow);
    };
  }, [posts, viewMap]);

  // ===== E) 목록 정규화 =====
  const normalizedPosts = useMemo(() => posts.map((p) => {
    const id = getPostId(p);
    const vcFromList = extractViewCount(p);
    const mergedVC = vcFromList != null ? vcFromList : (id != null ? viewMap[id] ?? 0 : 0);
    return { ...p, viewCount: mergedVC, commentCount: extractCommentCount(p) };
  }), [posts, viewMap]);

  // --- 페이지 & 검색 핸들러 ---
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSubmittedSearch(searchQuery);
  };

  if (loading) return <div className="p-10">게시글 불러오는 중...</div>;

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex-1">

        {/* ===== 오늘의 추천 돌봄 ===== */}
        {getToken() && (recsLoading || recs.length > 0 || recsError) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3">오늘의 추천 돌봄</h2>
            {recsLoading && <div className="text-gray-500">불러오는 중…</div>}
            {!!recsError && !recsLoading && (
              <div className="text-sm text-red-500">{recsError}</div>
            )}
            {!recsLoading && recs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recs.map((r) => (
                  <RecCard key={r.id ?? r.username ?? Math.random()} rec={r} />
                ))}
              </div>
            )}
          </section>
        )}

        <h1 className="text-3xl font-bold mb-6">전체글 보기</h1>
        <BoardControls category={categoryKor} onCategoryChange={setCategoryKor} showWriteButton />
        <PostTable
          posts={normalizedPosts}
          userMap={userMap}
          emptyMessage={needLogin ? '로그인 후 확인 가능합니다.' : '게시글이 없습니다.'}
        />
      </div>

      <div className="w-full py-8" style={{ backgroundColor: '#F2F2F2' }}>
        <PaginationAndSearch
          currentPage={page}
          totalPages={pageInfo.totalPages}
          onPageChange={handlePageChange}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearchSubmit={handleSearchSubmit}
        />
      </div>
    </div>
  );
}
