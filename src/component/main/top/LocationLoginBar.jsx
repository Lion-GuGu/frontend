import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getToken, clearToken, fetchMe } from '../../../lib/api';

// JWT payload 안전 파서
function decodeJwtSafe(token) {
  try {
    const payload = token.split('.')[1];
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
    const json = atob(pad);
    const uri = Array.from(json)
      .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    return JSON.parse(decodeURIComponent(uri));
  } catch {
    return null;
  }
}

export default function LocationLoginBar() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setMe(null);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // 1. 기본 사용자 정보 가져오기 (id, username 등)
        const baseUser = await fetchMe();
        if (!baseUser || !baseUser.id) {
          throw new Error('기본 사용자 정보를 가져올 수 없습니다.');
        }

        // 2. 명세서 기반으로 id를 사용해 전체 사용자 정보 (주소 포함) 다시 요청
        const { data: fullUser } = await api.get(`/users/${baseUser.id}`);
        setMe(fullUser); // 주소가 포함된 전체 정보로 상태 업데이트

      } catch (err) {
        console.error("사용자 정보 로딩 실패:", err);
        // API 요청 실패 시 JWT 토큰에서 최소 정보 파싱 (주소 정보는 없음)
        const p = decodeJwtSafe(token);
        if (p) {
          setMe({
            username: p.username || p.sub || p.name || '사용자',
            name: p.name,
          });
        } else {
          setMe(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onLogout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    clearToken();
    setMe(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="w-full px-4 md:px-8 py-2 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <span>📍</span>
        {me && me.childResidence ? (
          <span>{me.childResidence}</span>
        ) : (
          <span>{loading ? '위치 확인 중...' : '로그인 후 위치 정보 표시'}</span>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse text-gray-400">확인 중...</div>
      ) : me ? (
        <div className="flex items-center gap-3">
          <span className="text-gray-700">
            <b>{me.name || me.username || '사용자'}</b>님
          </span>
          <button
            onClick={onLogout}
            className="rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <nav className="space-x-4 [&>a]:!text-gray-600 [&>a:visited]:!text-gray-600 [&>a:hover]:!text-gray-800 [&>a:hover]:underline">
          <Link to="/login">로그인</Link>
          <span className="text-gray-300">/</span>
          <Link to="/register">회원가입</Link>
        </nav>
      )}
    </div>
  );
}