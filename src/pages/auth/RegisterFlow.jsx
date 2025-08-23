// src/pages/auth/RegisterFlow.jsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';
import Breadcrumb from '../../component/auth/Breadcrumb';
import api from '../../lib/api';
import checkIcon from '../../assets/check.svg';
import loginIcon from '../../assets/login.svg';

export default function RegisterFlow() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const base = state?.base; // { username, name, email, password }

  // base 없으면 처음으로
  useEffect(() => {
    if (!base) navigate('/register', { replace: true });
  }, [base, navigate]);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    age: '',
    gender: '',
    address: '',
  });

  const handleChangeTab = useCallback(
    (next) => { navigate('/', { state: { tab: next } }); },
    [navigate]
  );
  const handleCalendarClick = useCallback(() => navigate('/schedule'), [navigate]);

  const breadcrumbPaths = [
    { name: '계정', href: '/account' },
    { name: '계정 생성', href: '/register' },
    { name: '추가 정보', href: '/register-flow' },
  ];
  const progressText = step <= 3 ? `${step}/3` : null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 각 단계의 유효성
  const canNext = useMemo(() => {
    if (step === 1) return !!formData.school.trim();
    if (step === 2) {
      const ageNum = Number(formData.age);
      return !!formData.gender && Number.isFinite(ageNum) && ageNum > 0;
    }
    if (step === 3) return !!formData.address.trim();
    return true;
  }, [step, formData]);

  const next = async () => {
    if (!canNext) return; // 빈칸이면 넘어가지 않음

    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    // step === 3 → 서버 전송
    const payload = {
      username: base.username,
      password: base.password,
      name: base.name,
      email: base.email,
      childAge: Number(formData.age) || 0,
      childGender: formData.gender,
      childSchool: formData.school.trim(),
      childResidence: formData.address.trim(),
    };

    try {
      setSubmitting(true);
      await api.post('/api/auth/signup', payload);
      setStep(4);
    } catch (err) {
      console.error('회원가입 실패:', err);
      const status = err?.response?.status;
      if (status === 409) alert('이미 존재하는 아이디/이메일입니다.');
      else alert('회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col text-gray-900">
      <TopBar onChangeTab={handleChangeTab} onCalendarClick={handleCalendarClick} />

      <main className="flex-grow flex flex-col items-center py-8">
        <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
          <Breadcrumb paths={breadcrumbPaths} />
          {progressText && <span className="text-sm text-gray-500 font-medium">{progressText}</span>}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white shadow-md rounded-xl p-8 w-96 text-center pt-12">
            <h2 className="font-bold text-xl mb-4">아이의 학교</h2>
            <input
              name="school"
              value={formData.school}
              onChange={onChange}
              placeholder="학교 이름"
              className="w-full border px-3 py-2 mb-4 rounded"
              style={{ borderColor: '#E6E6E6' }}
            />
            <button
              onClick={next}
              disabled={!canNext}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-lg font-bold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEAA45] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FEAA45' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white shadow-md rounded-xl p-8 w-96 text-center pt-12">
            <h2 className="font-bold text-xl mb-4">아이의 나이와 성별</h2>
            <input
              name="age"
              type="number"
              min="1"
              value={formData.age}
              onChange={onChange}
              placeholder="아이의 나이 (숫자)"
              className="w-full border px-3 py-2 mb-4 rounded"
              style={{ borderColor: '#E6E6E6' }}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={onChange}
              className="w-full border px-3 py-2 mb-4 rounded bg-white"
              style={{ borderColor: '#E6E6E6' }}
            >
              <option value="">성별 선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
            <button
              onClick={next}
              disabled={!canNext}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-lg font-bold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEAA45] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FEAA45' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-white shadow-md rounded-xl p-8 w-96 text-center pt-12">
            <h2 className="font-bold text-xl mb-4">거주 지역 주소</h2>
            <input
              name="address"
              value={formData.address}
              onChange={onChange}
              placeholder="현재 거주지 주소"
              className="w-full border px-3 py-2 mb-4 rounded"
              style={{ borderColor: '#E6E6E6' }}
            />
            <button
              onClick={next}
              disabled={!canNext || submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-lg font-bold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEAA45] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FEAA45' }}
            >
              {submitting ? '등록 중...' : '완료'}
            </button>
          </div>
        )}

        {/* Step 4 (완료) */}
        {step === 4 && (
          <div className="bg-white shadow-md rounded-xl p-8 w-96 text-center pt-12">
            <img src={checkIcon} alt="완료 아이콘" className="mx-auto mb-4 w-10 h-10" />
            <h2 className="font-bold text-xl mb-2">회원가입이 완료 되었습니다!</h2>
            <p className="text-gray-600 mb-6">
              품아이에 오신 걸 환영합니다. <br />
              안전하고 따뜻한 지역 돌봄 서비스를 만들어가요.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-lg font-bold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEAA45]"
              style={{ backgroundColor: '#FEAA45' }}
            >
              <img src={loginIcon} alt="로그인 아이콘" className="w-5 h-5" />
              로그인으로 돌아가기
            </button>
          </div>
        )}
      </main>

      <BottomFooter />
    </div>
  );
}
