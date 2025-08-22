// src/pages/community/PostDetailPage.jsx
import React, { useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';
import { dummyPosts } from '../../db/dummyPosts';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  // ✅ 모든 탭은 메인('/')으로 이동 + 열 탭을 state로 전달 (커뮤니티 포함)
  const handleChangeTab = useCallback(
    (next) => {
      navigate('/', { state: { tab: next } });
    },
    [navigate]
  );

  const handleCalendarClick = useCallback(() => navigate('/calendar'), [navigate]);

  const post = dummyPosts.find((p) => p.id === parseInt(postId, 10));

  // 아바타(없으면 이니셜 플레이스홀더)
  const avatarOf = (name = 'U', size = 40) =>
    `https://placehold.co/${size}x${size}/E5E7EB/111?text=${encodeURIComponent(
      name?.[0] ?? 'U'
    )}`;

  // ------------------ Not Found ------------------
  if (!post) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
        <TopBar
          activeTab="커뮤니티"
          onChangeTab={handleChangeTab}
          onCalendarClick={handleCalendarClick}
        />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-8">
              <p className="text-center text-gray-500">게시글을 찾을 수 없습니다.</p>
              <div className="text-center mt-4">
                {/* ✅ 목록으로도 메인 + 커뮤니티 탭 지정 */}
                <Link to="/" state={{ tab: '커뮤니티' }} className="text-blue-500 hover:underline">
                  목록으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </main>
        <BottomFooter />
      </div>
    );
  }

  // ------------------ Page ------------------
  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <TopBar
        activeTab="커뮤니티"
        onChangeTab={handleChangeTab}
        onCalendarClick={handleCalendarClick}
      />

      <main className="flex-1 flex flex-col min-h-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* 카드 전체 */}
          <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
            {/* 상단 카테고리 컬러 고정 + 클릭 시 커뮤 탭으로 */}
            <p className="text-sm mb-2">
              <Link
                to="/"
                state={{ tab: '커뮤니티' }}          // ✅ 커뮤니티 탭으로 이동
                className="font-semibold hover:underline"
                style={{ color: '#FEAA45' }}
              >
                {(post.category || '질문')} &gt;
              </Link>
            </p>

            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>

            {/* 프로필 */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src={post.authorAvatar || avatarOf(post.author, 40)}
                alt="author avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="leading-tight">
                <div className="font-semibold text-gray-900">{post.author}</div>
                <div className="text-xs text-gray-400 mt-1">{post.date}</div>
              </div>
            </div>

            {/* 얇은 구분선 */}
            <div className="h-[0.5px] bg-[#E2E8F0] my-2" role="separator" aria-hidden="true" />

            {/* 본문 */}
            <div
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* 댓글 섹션 */}
            <div className="comments-section mt-10 space-y-6">
              {post.comments?.map((comment) => (
                // 답글은 카드 스타일 제거
                <div key={comment.id} className="pt-2">
                  <div className="flex items-start gap-3 mb-2">
                    <img
                      src={comment.avatar || avatarOf(comment.author, 32)}
                      alt="comment avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{comment.author}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{comment.date}</div>
                    </div>
                  </div>
                  <div
                    className="text-gray-700 text-sm"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </div>
              ))}

              {/* 댓글 입력 박스 */}
              <div className="mt-2 border border-gray-200 rounded-xl bg-white p-4">
                <div className="font-semibold mb-2">Kumoh</div>
                <textarea
                  className="
                    w-full h-16 md:h-20
                    max-h-40 overflow-y-auto
                    p-3 rounded-md bg-transparent
                    border-0 outline-none
                    focus:outline-none focus:ring-0 focus:border-0
                    resize-none
                  "
                  placeholder="댓글을 남겨보세요"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 카드 끝 */}
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}
