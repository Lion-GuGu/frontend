import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/main/MainPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx'; 
import RegisterPage from './pages/auth/RegisterPage.jsx'; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
