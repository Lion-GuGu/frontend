import React from 'react';
import Breadcrumb from '../../component/auth/Breadcrumb';
import AuthForm from '../../component/auth/AuthForm';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';

// 페이지의 메인 컨텐츠
const RegisterSection = () => {
    const registerPaths = [
        { name: '계정', href: '/account' },
        { name: '계정 생성', href: '/register' }
    ];

    const registerFields = [
        { id: 'name', label: '이름', type: 'text' },
        { id: 'email', label: '이메일', type: 'email' },
        { id: 'password', label: '비밀번호', type: 'password' },
        { id: 'confirmPassword', label: '비밀번호 확인', type: 'password' },
    ];

    const registerOptions = (
        <div className="flex items-center text-sm">
            <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                <label htmlFor="terms" className="ml-2 block text-gray-900">모든 약관에 동의합니다</label>
            </div>
        </div>
    );

    const handleRegister = (data) => {
        // 백엔드 API 연동 전 임시 기능
        alert(`회원가입 시도:\n${JSON.stringify(data, null, 2)}`);
    };

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
                        bottomLink={{ 
                            text: '이미 계정이 있으신가요?', 
                            linkText: '로그인', 
                            href: '/login' 
                        }}
                        onSubmit={handleRegister}
                    />
                </div>
            </div>
        </main>
    );
};


// 최종 회원가입 페이지
export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen flex flex-col text-gray-900">
      <TopBar />
      <RegisterSection />
      <BottomFooter />
    </div>
  );
}
