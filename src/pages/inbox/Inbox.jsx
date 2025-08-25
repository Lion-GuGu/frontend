import React, { useMemo, useState } from 'react';
import axios from 'axios';

// 👉 프로젝트에 공용 api 래퍼가 있다면 아래 한 줄로 교체하세요.
// import api from '../../lib/api';

// --- axios fallback (공용 래퍼 없을 때만 사용) ---
const api = axios.create({
  baseURL: 'https://kumohgugu.duckdns.org', // 또는 'http://15.164.169.237:8080'
  timeout: 10000,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 임시 데이터 ---
const mockRequests = [
  {
    id: 1,
    type: 'received', // 내가 제공자일 때 받은 돌봄 요청
    category: '긴급',
    categoryColor: 'bg-red-500 text-white',
    title: '병원 보호자 대기 돌봄',
    date: '2025-08-26',
    time: '11:00-13:00',
    details: '한빛 병원 소아과 대기실',
    requester: '홍길동',
    description: '대기 돌봄',
  },
  {
    id: 2,
    type: 'sent', // 내가 보낸(지원한) 상태
    category: '기타',
    categoryColor: 'bg-blue-500 text-white',
    title: '독서 시간 함께 해주기',
    date: '2025-08-29',
    time: '19:00-20:00',
    details: '202호 • 9세 남자아이',
    requester: '아무개',
    description: '독서 도우미',
    status: '상대 수락 대기',
  },
  {
    id: 3,
    type: 'sent',
    category: '기타',
    categoryColor: 'bg-blue-500 text-white',
    title: '수학 숙제 도와주기',
    date: '2025-08-30',
    time: '16:00-17:00',
    details: '101호 • 12세 여자아이',
    requester: '김철수',
    description: '수학 도우미',
    status: '수락 완료',
  },
];

// --- 카드 ---
function RequestCard({ request, onAccept, onDecline, disabled }) {
  return (
    <div className="p-5 rounded-lg border border-gray-200">
      <div className="flex items-start gap-3">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${request.categoryColor}`}>
          {request.category}
        </span>
        <div className="flex-grow">
          <h3 className="font-bold text-lg">{request.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {request.date} <span className="mx-1">•</span> {request.time}
            <span className="mx-1">•</span> {request.details} <span className="mx-1">/</span>
            <a href="#" className="underline !text-black visited:!text-black">
              {request.requester}
            </a>
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-medium text-gray-800">{request.description}</p>

        <div className="mt-3 flex items-center gap-2">
          {request.type === 'received' && (
            <>
              <button
                disabled={disabled}
                onClick={() => onAccept?.(request)}
                className="px-4 py-1.5 text-sm font-semibold rounded-md text-white disabled:opacity-60"
                style={{ backgroundColor: '#FEAA45' }}
              >
                {disabled ? '처리 중…' : '수락(지원)'}
              </button>
              <button
                disabled={disabled}
                onClick={() => onDecline?.(request)}
                className="px-4 py-1.5 text-sm font-semibold rounded-md text-gray-700 disabled:opacity-60"
                style={{ backgroundColor: '#F2F2F2' }}
              >
                거절
              </button>
            </>
          )}

          {request.type === 'sent' && (
            <span
              className="px-4 py-1.5 text-sm font-semibold rounded-md"
              style={{
                backgroundColor: request.status === '수락 완료' ? '#FEAA45' : '#F2F2F2',
                color: request.status === '수락 완료' ? 'white' : '#666666',
              }}
              title={request.applicationId ? `applicationId: ${request.applicationId}` : undefined}
            >
              {request.status || '지원 완료'}
              {request.applicationId ? ` (#${request.applicationId})` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// --- API helpers (명세 반영) ---
async function postCareApplication(requestId) {
  // Care Application: Body 없음 / 응답 { "id": 123 }
  const { data } = await api.post(`/api/requests/${requestId}/applications`);
  // data.id가 applicationId
  return data?.id;
}

async function postCareMatch(requestId, providerId) {
  // Care Match: Body { providerId } / 응답 { "matchId": 42 }
  const { data } = await api.post(`/api/requests/${requestId}/match`, { providerId });
  return data?.matchId;
}

// --- 페이지 ---
export default function Inbox() {
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState(mockRequests);
  const [loadingId, setLoadingId] = useState(null);

  const receivedRequests = useMemo(() => requests.filter((r) => r.type === 'received'), [requests]);
  const sentRequests = useMemo(() => requests.filter((r) => r.type === 'sent'), [requests]);

  const commonButton =
    'transition-all !border-none !outline-none !ring-0 focus:!ring-0 focus-visible:!outline-none !font-medium';

  // ✅ 수락(지원) → /applications 호출, 응답 id를 applicationId로 보관
  const handleAccept = async (req) => {
    if (loadingId) return;
    try {
      setLoadingId(req.id);
      const applicationId = await postCareApplication(req.id); // ← {id:123}
      // 받은요청 → 보낸요청(지원됨) 으로 이동
      setRequests((prev) => {
        const rest = prev.filter((r) => r.id !== req.id);
        const moved = {
          ...req,
          type: 'sent',
          status: '상대 수락 대기',
          applicationId, // 응답 id 저장
          categoryColor: 'bg-blue-500 text-white',
        };
        return [moved, ...rest];
      });
    } catch (err) {
      console.error(err);
      alert('지원 처리에 실패했어요.');
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ 거절: 현재 명세에 거절 API 없음 → UI에서만 제외
  const handleDecline = async (req) => {
    if (!confirm('이 요청을 거절하시겠어요?')) return;
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  // (참고) ✅ 매칭 확정: 요청자 화면에서 사용
  // await postCareMatch(requestId, providerId) → matchId 반환
  // 필요 시 이 컴포넌트/모달에서 호출하세요.
  // 예) const matchId = await postCareMatch(42, 5);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">우편함</h1>
        <div className="flex items-center bg-gray-100 p-1 rounded-lg text-sm gap-1">
          <button
            onClick={() => setActiveTab('received')}
            className={`${commonButton} px-6 py-2.5 rounded-md ${
              activeTab === 'received' ? '!bg-white shadow font-semibold text-black' : '!bg-gray-100 text-gray-500 !shadow-none'
            }`}
          >
            받은 요청
            <span
              className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${
                activeTab === 'received' ? 'bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {receivedRequests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`${commonButton} px-6 py-2.5 rounded-md ${
              activeTab === 'sent' ? '!bg-white shadow font-semibold text-black' : '!bg-gray-100 text-gray-500 !shadow-none'
            }`}
          >
            보낸 제안/요청
            <span
              className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${
                activeTab === 'sent' ? 'bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {sentRequests.length}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'received' &&
          receivedRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onAccept={handleAccept}
              onDecline={handleDecline}
              disabled={loadingId === req.id}
            />
          ))}

        {activeTab === 'sent' && sentRequests.map((req) => <RequestCard key={req.id} request={req} />)}
      </div>

      {loadingId && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow bg-black/80 text-white text-sm">
          처리 중…
        </div>
      )}
    </div>
  );
}
