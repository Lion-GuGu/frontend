import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setToken } from '../../lib/api'; // ✅ 변경
import Breadcrumb from '../../component/auth/Breadcrumb';
import AuthForm from '../../component/auth/AuthForm';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';

// 페이지의 메인 컨텐츠
const LoginSection = () => {
  const loginPaths = [
    { name: '계정', href: '/account' },
    { name: '로그인', href: '/login' }
  ];

  const loginFields = [
    { id: 'username', label: '아이디', type: 'text' },
    { id: 'password', label: '비밀번호', type: 'password' },
  ];

  const loginOptions = (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center">
        <input id="remember-me" name="remember-me" type="checkbox"
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
        <label htmlFor="remember-me" className="ml-2 block text-gray-900">기억하시겠습니까?</label>
      </div>
      <a href="#" className="font-medium" style={{ color: '#666666' }}>비밀번호를 잊으셨나요?</a>
    </div>
  );

  // ✅ API 연동
  const handleLogin = async (data) => {
    try {
      const remember = document.getElementById('remember-me')?.checked ?? false;

      const { data: res } = await api.post("/api/auth/login", {
        username: data.username,
        password: data.password
      });

      // 서버가 { access_token: "..."} 형태로 준다고 가정
      setToken(res.access_token, remember); // ✅ 저장 + axios 헤더 세팅

      alert("로그인 성공!");
      // 원하면 홈/이전페이지로 이동
      const back = sessionStorage.getItem('postLoginRedirect');
      window.location.href = back || '/';
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패. 아이디/비밀번호를 확인하세요.");
    }
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb paths={loginPaths} />
        <div className="mt-8">
          <AuthForm
            title="로그인"
            fields={loginFields}
            options={loginOptions}
            submitText="로그인"
            bottomLink={{ text: '계정이 없으신가요?', linkText: '계정 생성', href: '/register' }}
            onSubmit={handleLogin}
          />
        </div>
      </div>
    </main>
  );
};

export default function LoginPage() {
  const navigate = useNavigate();

  const handleChangeTab = useCallback(
    (next) => { navigate('/', { state: { tab: next } }); },
    [navigate]
  );

  const handleCalendarClick = useCallback(() => navigate('/calendar'), [navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col text-gray-900">
      <TopBar onChangeTab={handleChangeTab} onCalendarClick={handleCalendarClick} />
      <LoginSection />
      <BottomFooter />
    </div>
  );
}
