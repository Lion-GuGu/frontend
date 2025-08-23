// src/pages/auth/RegisterPage.jsx
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../component/auth/Breadcrumb';
import AuthForm from '../../component/auth/AuthForm';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';

const RegisterSection = ({ onRegister }) => {
  const registerPaths = [
    { name: '계정', href: '/account' },
    { name: '계정 생성', href: '/register' },
  ];

  // ✅ username 포함
  const registerFields = [
    { id: 'username', label: '아이디', type: 'text' },
    { id: 'name', label: '이름', type: 'text' },
    { id: 'email', label: '이메일', type: 'email' },
    { id: 'password', label: '비밀번호', type: 'password' },
    { id: 'confirmPassword', label: '비밀번호 확인', type: 'password' },
  ];

  const registerOptions = (
    <div className="flex items-center text-sm">
      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-gray-900">
          모든 약관에 동의합니다
        </label>
      </div>
    </div>
  );

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb paths={registerPaths} />
        <div className="mt-8">
          <AuthForm
            title="계정 생성"
            fields={registerFields}
            options={registerOptions}
            submitText="계정 생성"
            bottomLink={{ text: '이미 계정이 있으신가요?', linkText: '로그인', href: '/login' }}
            onSubmit={onRegister}
          />
        </div>
      </div>
    </main>
  );
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleChangeTab = useCallback(
    (next) => { navigate('/', { state: { tab: next } }); },
    [navigate]
  );
  const handleCalendarClick = useCallback(() => navigate('/calendar'), [navigate]);

  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

  // ✅ 제출 시 강력 검증: 빈칸, 이메일 형식, 비번 일치, 약관
  const handleRegister = (data) => {
    const agree = document.getElementById('terms')?.checked ?? false;

    const username = (data.username || '').trim();
    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const password = data.password || '';
    const confirm = data.confirmPassword || '';

    if (!agree) return alert('약관에 동의해 주세요.');
    if (!username || !name || !email || !password || !confirm) {
      return alert('모든 항목을 입력해 주세요.');
    }
    if (!isEmail(email)) return alert('이메일 형식이 올바르지 않습니다.');
    if (password !== confirm) return alert('비밀번호와 확인이 일치하지 않습니다.');

    // 다음 단계로 기본 정보 전달
    navigate('/register-flow', { state: { base: { username, name, email, password } } });
  };

  return (
    <div className="w-full min-h-screen flex flex-col text-gray-900">
      <TopBar onChangeTab={handleChangeTab} onCalendarClick={handleCalendarClick} />
      <RegisterSection onRegister={handleRegister} />
      <BottomFooter />
    </div>
  );
}
