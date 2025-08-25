// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../lib/api";

export default function ProtectedRoute() {
  const token = getToken();
  const loc = useLocation();

  if (!token) {
    // 로그인 후 돌아올 위치 저장(선택)
    sessionStorage.setItem('postLoginRedirect', loc.pathname + loc.search);
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
