import React from 'react';
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
        { id: 'email', label: '이메일', type: 'email' },
        { id: 'password', label: '비밀번호', type: 'password' },
    ];

    const loginOptions = (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-gray-900">기억하시겠습니까?</label>
            </div>
            <a href="#" className="font-medium" style={{color: '#666666'}}>비밀번호를 잊으셨나요?</a>
        </div>
    );

    const handleLogin = (data) => {
        alert(`로그인 시도:\n${JSON.stringify(data, null, 2)}`);
    };

    return (
        <main className="flex-grow">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumb paths={loginPaths} />
                <div className="mt-8">
                    <AuthForm
                        title="로그인"
                        fields={loginFields}
                        options={loginOptions}
                        submitText="로그인"
                        bottomLink={{ 
                            text: '계정이 없으신가요?', 
                            linkText: '계정 생성', 
                            href: '/register' 
                        }}
                        onSubmit={handleLogin}
                    />
                </div>
            </div>
        </main>
    );
};


// 최종 로그인 페이지
export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex flex-col text-gray-900">
      <TopBar />
      <LoginSection />
      <BottomFooter />
    </div>
  );
}
