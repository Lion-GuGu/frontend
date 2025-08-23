// src/lib/api.js
import axios from "axios";

export const AUTH_KEY = "access_token";

const api = axios.create({
  baseURL: "http://15.164.169.237:8080",
  // withCredentials: true, // ← HttpOnly 쿠키 쓸 때만 켜세요
  timeout: 10000,
});

// ---- 토큰 저장/조회/삭제 ----
export function getToken() {
  return sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
}

export function setToken(token, remember) {
  if (!token) return;
  if (remember) {
    localStorage.setItem(AUTH_KEY, token);
    sessionStorage.removeItem(AUTH_KEY);
  } else {
    sessionStorage.setItem(AUTH_KEY, token);
    localStorage.removeItem(AUTH_KEY);
  }
}

export function clearToken() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

// ✅ 매 요청마다 최신 토큰을 헤더에 반영
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  else delete config.headers.Authorization;
  return config;
});

// 401 발생 시 토큰 정리 (원하면 여기서 /refresh 붙여도 됨)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401) {
      clearToken();
      // 옵션: 자동 이동
      // if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
