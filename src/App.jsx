import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 양쪽 브랜치의 모든 페이지를 import 합니다.
import HomePage from './pages/main/MainPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import RegisterFlow from './pages/auth/RegisterFlow.jsx';
import UserReviewsPage from './pages/userReview/UserReviewsPage.jsx';
import CreatePostPage from './pages/community/CreatePostPage.jsx';
import PostDetailPage from './pages/community/PostDetailPage.jsx';
import Schedule from './pages/schedule/Schedule.jsx';
import ScheduleMonth from "./pages/scheduleMonth/ScheduleMonth.jsx"; // review 브랜치에서 추가

// 보호 라우트
import ProtectedRoute from './routes/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* 로그인 필요 구역 (main 브랜치 구조 유지) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/scheduleMonth" element={<ScheduleMonth />} /> {/* review 브랜치의 경로 추가 */}
        <Route path="/community/new" element={<CreatePostPage />} />
      </Route>

      {/* 탭 직접 접근 시 홈으로 보내며 탭 열기 */}
      <Route path="/community" element={<Navigate to="/" state={{ tab: '커뮤니티' }} replace />} />
      <Route path="/store"     element={<Navigate to="/" state={{ tab: '스토어' }} replace />} />
      <Route path="/inbox"     element={<Navigate to="/" state={{ tab: '우편함' }} replace />} />

      {/* 인증 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-flow" element={<RegisterFlow />} />

      {/* 유저 리뷰(공개) */}
      <Route path="/reviews/:userId" element={<UserReviewsPage />} />

      {/* 커뮤니티 상세(공개 열람) */}
      <Route path="/community/:postId" element={<PostDetailPage />} />

      {/* 그 외 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}