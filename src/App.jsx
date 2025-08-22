import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/main/MainPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import UserReviewsPage from './pages/userReview/UserReviewsPage.jsx';
import CreatePostPage from './pages/community/CreatePostPage.jsx';
import PostDetailPage from './pages/community/PostDetailPage.jsx';
import Schedule from './pages/schedule/Schedule.jsx';

export default function App() {
  return (
    <Routes>
      {/* 홈/공통 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/schedule" element={<Schedule />} />

      {/* 탭 직접 접근 시 홈으로 보내며 탭 열기 */}
      <Route path="/community" element={<Navigate to="/" state={{ tab: '커뮤니티' }} replace />} />
      <Route path="/store"     element={<Navigate to="/" state={{ tab: '스토어' }} replace />} />
      <Route path="/inbox"     element={<Navigate to="/" state={{ tab: '우편함' }} replace />} />

      {/* 인증 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 유저 리뷰 */}
      <Route path="/reviews/:userId" element={<UserReviewsPage />} />

      {/* 커뮤니티 상세/글쓰기 */}
      <Route path="/community/new" element={<CreatePostPage />} />
      <Route path="/community/:postId" element={<PostDetailPage />} />

      {/* 그 외 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
