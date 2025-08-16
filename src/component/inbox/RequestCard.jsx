import React from 'react';

export default function RequestCard({ request }) {
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
