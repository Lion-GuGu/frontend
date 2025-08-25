// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// EventContext
import { EventProvider } from "./pages/schedule/EventContext";

// 페이지
import HomePage from "./pages/main/MainPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import RegisterFlow from "./pages/auth/RegisterFlow.jsx";
import UserReviewsPage from "./pages/userReview/UserReviewsPage.jsx";
import CreatePostPage from "./pages/community/CreatePostPage.jsx";
import EditPostPage from "./pages/community/EditPostPage.jsx";
import PostDetailPage from "./pages/community/PostDetailPage.jsx";
import ScheduleWeek from "./pages/schedule/ScheduleWeek.jsx";
import ScheduleMonth from "./pages/schedule/ScheduleMonth.jsx";
import PointsPage from "./pages/points/PointsPage.jsx";

// 보호 라우트
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <EventProvider>
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<HomePage />} />

        {/* 로그인 필요 구역 */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/schedule"
            element={<Navigate to="/scheduleWeek" replace />}
          />
          <Route path="/scheduleWeek" element={<ScheduleWeek />} />
          <Route path="/scheduleMonth" element={<ScheduleMonth />} />
          <Route path="/community/new" element={<CreatePostPage />} />
          <Route path="/community/edit/:postId" element={<EditPostPage />} />
          <Route path="/points" element={<PointsPage />} />
        </Route>

        {/* 탭 직접 접근 시 홈으로 */}
        <Route
          path="/community"
          element={<Navigate to="/" state={{ tab: "커뮤니티" }} replace />}
        />
        <Route
          path="/store"
          element={<Navigate to="/" state={{ tab: "스토어" }} replace />}
        />
        <Route
          path="/inbox"
          element={<Navigate to="/" state={{ tab: "우편함" }} replace />}
        />

        {/* 인증 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-flow" element={<RegisterFlow />} />

        {/* 유저 리뷰 */}
        <Route path="/reviews/:userId" element={<UserReviewsPage />} />

        {/* 커뮤니티 상세 */}
        <Route path="/community/:postId" element={<PostDetailPage />} />

        {/* 그 외 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </EventProvider>
  );
}
