import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/main/MainPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import UserReviewsPage from './pages/userReview/UserReviewsPage.jsx';
import CreatePostPage from './pages/community/CreatePostPage.jsx';
import PostDetailPage from './pages/community/PostDetailPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reviews/:userId" element={<UserReviewsPage />} />
      <Route path="/community/new" element={<CreatePostPage />} />
      <Route path="/community/:postId" element={<PostDetailPage />} />
    </Routes>
  );
}