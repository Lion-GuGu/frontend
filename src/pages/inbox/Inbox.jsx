import React, { useState } from 'react';

// --- 임시 목업 데이터 ---
const mockRequests = [
    {
        id: 1,
        type: 'received',
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
        type: 'sent',
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

// --- 요청 카드 컴포넌트 ---
const RequestCard = ({ request }) => {
    return (
        <div className="p-5 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${request.categoryColor}`}>
                    {request.category}
                </span>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg">{request.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {request.date} <span className="mx-1">•</span> {request.time} <span className="mx-1">•</span> {request.details} <span className="mx-1">/</span> 
                        <a href="#" className="underline !text-black visited:!text-black">{request.requester}</a>
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <p className="font-medium text-gray-800">{request.description}</p>
                <div className="mt-3 flex items-center gap-2">
                    {request.type === 'received' && (
                        <>
                            <button className="px-4 py-1.5 text-sm font-semibold rounded-md text-white" style={{ backgroundColor: '#FEAA45' }}>
                                수락
                            </button>
                            <button className="px-4 py-1.5 text-sm font-semibold rounded-md text-gray-700" style={{ backgroundColor: '#F2F2F2' }}>
                                거절
                            </button>
                        </>
                    )}
                    {request.type === 'sent' && (
                        <span 
                            className="px-4 py-1.5 text-sm font-semibold rounded-md"
                            style={{
                                backgroundColor: request.status === '수락 완료' ? '#FEAA45' : '#F2F2F2',
                                color: request.status === '수락 완료' ? 'white' : '#666666'
                            }}
                        >
                            {request.status}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- 우편함 페이지 메인 컴포넌트 ---
export default function Inbox() {
    const [activeTab, setActiveTab] = useState('received');
    const [requests, setRequests] = useState(mockRequests);

    const receivedRequests = requests.filter(r => r.type === 'received');
    const sentRequests = requests.filter(r => r.type === 'sent');
    
    // index.css의 영향을 받지 않도록 모든 관련 스타일을 !important로 강제합니다.
    const commonButtonStyles = "transition-all !border-none !outline-none !ring-0 focus:!ring-0 focus-visible:!outline-none !font-medium";

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">우편함</h1>
                <div className="flex items-center bg-gray-100 p-1 rounded-lg text-sm gap-1">
                    <button 
                        onClick={() => setActiveTab('received')}
                        className={`${commonButtonStyles} px-6 py-2.5 rounded-md ${activeTab === 'received' ? '!bg-white shadow font-semibold text-black' : '!bg-gray-100 text-gray-500 !shadow-none'}`}
                    >
                        받은 요청 
                        <span className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${activeTab === 'received' ? 'bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-500'}`}>
                            {receivedRequests.length}
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('sent')}
                        className={`${commonButtonStyles} px-6 py-2.5 rounded-md ${activeTab === 'sent' ? '!bg-white shadow font-semibold text-black' : '!bg-gray-100 text-gray-500 !shadow-none'}`}
                    >
                        보낸 제안/요청 
                        <span className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${activeTab === 'sent' ? 'bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-500'}`}>
                            {sentRequests.length}
                        </span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {activeTab === 'received' && receivedRequests.map(req => 
                    <RequestCard key={req.id} request={req} />
                )}
                {activeTab === 'sent' && sentRequests.map(req => 
                    <RequestCard key={req.id} request={req} />
                )}
            </div>
        </div>
    );
}
