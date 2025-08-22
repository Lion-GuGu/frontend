import React, { useRef, useState, useEffect } from 'react';
import BoardControls from '../../component/community/BoardControls';
import PostTable from '../../component/community/PostTable';
import PaginationAndSearch from '../../component/community/PaginationAndSearch';
import { dummyPosts } from '../../db/dummyPosts';

// --- 임시 목업 데이터 ---
const mockPosts = [
    { id: 1, category: '질문', title: '아이 낮잠이 너무 짧은데 괜찮을까요?', author: '재주미미', date: '00:34', views: 3, authorColor: 'bg-orange-100 text-orange-800' },
    { id: 2, category: '질문', title: '돌봄 선생님과 갈등 있을 때 어떻게 하시나요?', author: '프랜드림', date: '00:10', views: 10, authorColor: 'bg-yellow-100 text-yellow-800' },
    { id: 3, category: '자유', title: '주말에 같이 아이들과 갈만한 곳 추천해요', author: '파랑맘맘', date: '00:01', views: 8, authorColor: 'bg-green-100 text-green-800' },
    { id: 4, category: '중고나눔', title: '아기 젖병 소독기 필요하신 분 계실까요?', author: '째미맘', date: '2025.08.25', views: 30, authorColor: 'bg-teal-100 text-teal-800' },
    { id: 5, category: '자유', title: '주말에 가족 나들이 어디 가세요?', author: '하나자두', date: '2025.08.25', views: 34, authorColor: 'bg-cyan-100 text-cyan-800' },
    { id: 6, category: '중고나눔', title: '사용감 있는 아기띠, 필요하신 분 가져가세요', author: '유니미미맘2', date: '2025.08.25', views: 66, authorColor: 'bg-sky-100 text-sky-800' },
    { id: 7, category: '자유', title: '오늘 아이랑 만든 쿠키 자랑해요 🍪', author: '첼로디아', date: '2025.08.25', views: 52, authorColor: 'bg-blue-100 text-blue-800' },
    { id: 8, category: '중고나눔', title: '유아 영어 그림책 세트', author: '짱짱돌', date: '2025.08.25', views: 29, authorColor: 'bg-indigo-100 text-indigo-800' },
    { id: 9, category: '중고나눔', title: '가습기 무료로 드립니다', author: '필요내용', date: '2025.08.25', views: 42, authorColor: 'bg-purple-100 text-purple-800' },
    { id: 10, category: '중고나눔', title: '유아 전용 식탁의자', author: '오구맘', date: '2025.08.25', views: 15, authorColor: 'bg-pink-100 text-pink-800' },
];

// --- 커뮤니티 페이지 컴포넌트 ---
export default function CommunityPage() {
    const [posts, setPosts] = useState(mockPosts);
    
    return (
        // 6. 하단 영역 고정을 위한 레이아웃 수정
        <div className="w-full flex-1 flex flex-col">
            {/* 메인 컨텐츠 영역 (게시판) */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex-1">
                <h1 className="text-3xl font-bold mb-6">전체글 보기</h1>
                
                <BoardControls />
                <PostTable posts={posts} />
            </div>
            
            {/* 6. 하단 고정 영역 (페이지네이션, 검색) */}
            <div className="w-full py-8" style={{backgroundColor: '#F2F2F2'}}>
                <PaginationAndSearch />
            </div>
        </div>
    );
}
