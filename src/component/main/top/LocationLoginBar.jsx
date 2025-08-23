import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getToken, clearToken } from '../../../lib/api'; // 경로는 프로젝트 구조에 맞게 조정

// 간단한 JWT 디코더 (payload만 파싱)
function decodeJwt(token) {
  const [, payload] = token.split('.');
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
}

export default function LocationLoginBar({ locationText }) {
  const [me, setMe] = useState(null);       // { username, name, ... }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 로그인 사용자 정보 가져오기
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // 1) 서버에 자기정보 API가 있으면 사용 (예: /api/users/me)
        const { data } = await api.get('/api/users/me');
        setMe(data);
      } catch {
        // 2) 없으면 토큰에서 최소 표시정보만 추출
        try {
          const p = decodeJwt(token);
          setMe({
            username: p.username || p.sub || p.name || '사용자',
          });
        } catch {
          // 토큰 파싱 실패 → 비로그인처럼 처리
          setMe(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onLogout = useCallback(async () => {
    try {
      // 서버에 로그아웃 엔드포인트가 있다면(선택)
      await api.post('/api/auth/logout');
    } catch (_) {
      // 없어도 무시하고 토큰만 제거
    }
    clearToken();
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="w-full px-4 md:px-8 py-2 flex items-center justify-between text-xs text-gray-500">
      <div>{locationText}</div>

      {/* 오른쪽 영역 */}
      {loading ? (
        <div className="animate-pulse text-gray-400">확인 중...</div>
      ) : me ? (
        // ✅ 로그인 상태: 회원 정보 + 로그아웃
        <div className="flex items-center gap-3">
          <span className="text-gray-700">
            <b>{me.name || me.username || '사용자'}</b>님
          </span>

          {/* 필요 시 마이페이지 링크 */}
          {/* <Link to="/mypage" className="text-gray-600 hover:text-gray-800 hover:underline">마이페이지</Link> */}

          <button
            onClick={onLogout}
            className="rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      ) : (
        // ❌ 비로그인 상태: 로그인/회원가입
        <nav className="space-x-4 [&>a]:!text-gray-600 [&>a:visited]:!text-gray-600 [&>a:hover]:!text-gray-800 [&>a:hover]:underline [&>a:focus]:!text-gray-800 [&>a:active]:!text-gray-800">
          <Link to="/login">로그인</Link>
          <span className="text-gray-300">/</span>
          <Link to="/register">회원가입</Link>
        </nav>
      )}
    </div>
  );
}
