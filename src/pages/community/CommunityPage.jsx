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

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [viewMap, setViewMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);
  const [categoryKor, setCategoryKor] = useState('전체');

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

  // 1) 글 목록 (페이지/검색어 변경 시 다시 불러오도록 수정)
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
          ...(submittedSearch ? { q: submittedSearch } : {}), // 검색어 파라미터 추가
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
  }, [categoryEnum, page, size, submittedSearch]); // submittedSearch가 변경될 때도 재실행

  // 2) 작성자 정보 조회 (이전과 동일)
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

  // 3) 조회수 병합 로직 (이전과 동일)
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

  // 4) 목록용 정규화 (이전과 동일)
  const normalizedPosts = useMemo(() => posts.map((p) => {
    const id = getPostId(p);
    const vcFromList = extractViewCount(p);
    const mergedVC = vcFromList != null ? vcFromList : (id != null ? viewMap[id] ?? 0 : 0);
    return { ...p, viewCount: mergedVC, commentCount: extractCommentCount(p), };
  }), [posts, viewMap]);

  // --- 페이지 & 검색 핸들러 함수들 ---
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // 검색 시 첫 페이지로 이동
    setSubmittedSearch(searchQuery);
  };
  // ------------------------------------

  if (loading) return <div className="p-10">게시글 불러오는 중...</div>;

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">전체글 보기</h1>
        <BoardControls category={categoryKor} onCategoryChange={setCategoryKor} showWriteButton />
        <PostTable posts={normalizedPosts} userMap={userMap} emptyMessage={needLogin ? '로그인 후 확인 가능합니다.' : '게시글이 없습니다.'} />
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