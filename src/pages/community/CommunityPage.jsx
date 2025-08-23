// src/pages/community/CommunityPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api, { getToken } from '../../lib/api';
import BoardControls from '../../component/community/BoardControls';
import PostTable from '../../component/community/PostTable';
import PaginationAndSearch from '../../component/community/PaginationAndSearch';

const KOR2ENUM = { '자유': 'FREE', '질문': 'QUESTION', '중고나눔': 'MARKET' };

// 글 객체에서 authorId 후보들을 최대한 잡아내기
function extractAuthorId(p) {
  return (
    p.authorId ??
    p.userId ??
    p.writerId ??
    p.createdById ??
    p.author?.id ??
    p.user?.id ??
    p.writer?.id ??
    p.createdBy?.id ??
    p.user_id ??
    null
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [userMap, setUserMap] = useState({}); // { [id]: {id, username, name, ...} }
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);
  const [categoryKor, setCategoryKor] = useState('전체');

  const page = 0;
  const size = 20;
  const categoryEnum = useMemo(
    () => (categoryKor === '전체' ? undefined : KOR2ENUM[categoryKor]),
    [categoryKor]
  );

  // 1) 글 목록
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
        const { data } = await api.get('/api/community/posts', {
          params: { page, size, ...(categoryEnum ? { category: categoryEnum } : {}) },
        });
        const items = Array.isArray(data)
          ? data
          : (data?.content ?? data?.items ?? data?.posts ?? []);
        if (alive) setPosts(items || []);
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

    return () => {
      alive = false;
    };
  }, [categoryEnum, page, size]);

  // 2) 작성자 정보 채워넣기
  useEffect(() => {
    let alive = true;
    (async () => {
      // 목록에서 ID만 뽑고, 이미 가진 건 제외
      const ids = Array.from(
        new Set(posts.map(extractAuthorId).filter((v) => v !== null && v !== undefined))
      );
      const missing = ids.filter((id) => !userMap[id]);
      if (missing.length === 0) return;

      try {
        // 개별 조회 (배치 API 없으니 /api/auth/users/{id} 병렬)
        const results = await Promise.allSettled(
          missing.map((id) => api.get(`/api/auth/users/${id}`))
        );
        if (!alive) return;

        const next = { ...userMap };
        results.forEach((r, idx) => {
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
    return () => {
      alive = false;
    };
  }, [posts]); // posts가 바뀔 때만 시도

  if (loading) return <div className="p-10">게시글 불러오는 중...</div>;

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">전체글 보기</h1>

        <BoardControls
          category={categoryKor}
          onCategoryChange={setCategoryKor}
          showWriteButton
        />

        <PostTable
          posts={posts}
          userMap={userMap}
          emptyMessage={needLogin ? '로그인 후 확인 가능합니다.' : '게시글이 없습니다.'}
        />
      </div>

      <div className="w-full py-8" style={{ backgroundColor: '#F2F2F2' }}>
        <PaginationAndSearch />
      </div>
    </div>
  );
}
