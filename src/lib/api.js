// src/lib/api.js
import axios from "axios";

export const AUTH_KEY = "access_token"; // 액세스 토큰 저장 키
export const AUTH_UID_KEY = "auth_uid"; // 로그인 시 받은 사용자 id 저장 키(옵션)

const api = axios.create({
  baseURL: "http://15.164.169.237:8080",
  // withCredentials: true, // ← 쿠키 세션을 쓸 때만 켜세요. (CORS 서버 설정 필요)
  timeout: 10000,
});

/* ============================
 * 토큰/UID 저장/조회/삭제
 * ============================ */
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
  // uid도 같이 정리
  localStorage.removeItem(AUTH_UID_KEY);
  sessionStorage.removeItem(AUTH_UID_KEY);
}

// 로그인 시 응답에서 받은 사용자 id를 저장해두면(/me 없이도) 조회 가능
export function setAuthUserId(uid, remember) {
  if (uid == null) return;
  const key = AUTH_UID_KEY;
  if (remember) {
    localStorage.setItem(key, String(uid));
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, String(uid));
    localStorage.removeItem(key);
  }
}

export function getAuthUserId() {
  return (
    sessionStorage.getItem(AUTH_UID_KEY) ||
    localStorage.getItem(AUTH_UID_KEY) ||
    null
  );
}

/* ===========================
 * Axios 인터셉터
 * =========================== */
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  else delete config.headers.Authorization;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401) {
      clearToken();
      // 필요하면 로그인 페이지로 리다이렉트
      // if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ================= 이벤트 API =================
const categoryColors = {
  긴급: "#f28b82",
  돌봄: "#f6bf26",
  교육: "#33b679",
  기타: "#8ab4f8",
  내일정: "#ED8611",
};

/* ============================
 * 유틸 & 헬퍼 API
 * ============================ */

// 안전한 JWT payload 파서 (base64url + padding 대응)
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
    const json = atob(pad);
    const uri = Array.from(json)
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
    return JSON.parse(decodeURIComponent(uri));
  } catch {
    return null;
  }
}

/** 내 정보 조회
 *  - 더 이상 /me 엔드포인트를 시도하지 않음(404/400 스팸 방지)
 *  - 우선 JWT에서 id 추출 → 실패 시 로그인 시 저장한 uid 사용
 *  - 둘 다 없으면 null 반환(비로그인 취급)
 */
export async function fetchMe() {
  // 1) JWT에서 id 꺼내기
  const t = getToken();
  const payload = t ? parseJwt(t) : null;
  const uidFromJwt =
    payload?.id ?? payload?.userId ?? payload?.uid ?? payload?.sub;

  // 2) 로그인 시 저장해둔 uid(선택) 사용
  const uidStored = getAuthUserId();

  const uid = uidFromJwt ?? uidStored;
  if (uid == null) {
    // 토큰/uid 모두 없으면 서버 호출 불가 -> 비로그인으로 간주
    return null;
  }

  const res = await api.get(`/api/auth/users/${uid}`);
  return res.data;
}

/** 사용자 단건 조회 (userMap 채우는 용) */
export async function fetchUserById(id) {
  const candidates = [`/api/auth/users/${id}`, `/api/users/${id}`];
  for (const url of candidates) {
    try {
      const res = await api.get(url);
      if (res?.status === 200 && res.data) return res.data;
    } catch (e) {
      if (e?.response?.status === 404) continue;
      throw e;
    }
  }
  throw new Error(`User not found for id=${id}`);
}

export const fetchEvents = async (start, end) => {
  try {
    const res = await api.get("/api/requests/events", {
      params: {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
      },
    });
    return res.data.map((e) => ({
      ...e,
      color: categoryColors[e.category] || "#8ab4f8",
    }));
  } catch (err) {
    console.error("일정 불러오기 실패", err);
    return [];
  }
};

export const addEventAPI = async (event) => {
  try {
    const res = await api.post("/api/requests", event);
    console.log("일정 등록 성공", res.data);
    return {
      ...res.data,
      color: categoryColors[res.data.category] || "#8ab4f8",
    };
  } catch (err) {
    if (err.response) {
      console.error("서버 오류", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("서버 응답 없음", err.request);
    } else {
      console.error("Axios 오류", err.message);
    }
    return null;
  }
};

export const updateEventAPI = async (event) => {
  try {
    const res = await api.put(`/api/requests/events/${event.id}`, event);
    return {
      ...res.data,
      color: categoryColors[res.data.category] || "#8ab4f8",
    };
  } catch (err) {
    console.error("일정 수정 실패", err);
    return null;
  }
};

export const deleteEventAPI = async (id) => {
  try {
    const res = await api.delete(`/api/requests/events/${id}`);
    return res.data;
  } catch (err) {
    console.error("일정 삭제 실패", err);
    return null;
  }
};

export default api;
