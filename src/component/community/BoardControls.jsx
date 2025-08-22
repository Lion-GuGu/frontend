import React from 'react';
// import { Link } from 'react-router-dom'; // Router 컨텍스트 오류를 해결하기 위해 Link 대신 a 태그를 사용합니다.

const PencilIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export default function BoardControls() {
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <label htmlFor="category" className="text-sm font-medium">카테고리:</label>
                <select id="category" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                    <option>전체</option>
                    <option>자유</option>
                    <option>질문</option>
                    <option>중고나눔</option>
                </select>
            </div>
            {/* '글쓰기' 버튼을 a 태그로 변경하여 라우터 컨텍스트 오류를 해결합니다. */}
            <a
                href="/community/new"
                className="flex items-center gap-2 px-4 py-2 font-semibold rounded-md text-sm !border-none no-underline"
                style={{ backgroundColor: '#FEAA4580', color: '#A25F0D' }}
            >
                <PencilIcon />
                글쓰기
            </a>
        </div>
    );
}
