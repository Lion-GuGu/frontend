import React from 'react';
import UserProfile from '../../component/review/UserProfile';
import ReviewCard from '../../component/review/ReviewCard';   
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';


const mockUser = {
  name: '홍길동',
  avatar: 'https://placehold.co/80x80/EFE2D2/7F5F2A?text=홍',
  rating: 5,
  reviewCount: 8,
  address: '경상북도 구미시 금오산로6길 12 아이파크더샵',
};

const mockReviews = [
  { id: 1, date: '2025-07-21', rating: 5, author: { name: '지안맘', avatar: 'https://placehold.co/48x48/BFDBFE/1E3A8A?text=지' }, comment: '아이들에게 책도 읽어주시고 간식까지 챙겨주셔서 너무 감사했어요' },
  { id: 2, date: '2025-08-23', rating: 4, author: { name: '민준맘', avatar: 'https://placehold.co/48x48/FBCFE8/831843?text=민' }, comment: '늘 친절하시고 아이 눈높이에 맞춰주셨어요.' },
  { id: 3, date: '2025-08-23', rating: 5, author: { name: '은우맘', avatar: 'https://placehold.co/48x48/D1FAE5/065F46?text=은' }, comment: '시간 약속 잘 지키시고 아이가 완전 좋아했어요.' },
  { id: 4, date: '2025-08-28', rating: 5, author: { name: '현우맘', avatar: 'https://placehold.co/48x48/FEE2E2/991B1B?text=현' }, comment: '아이랑 금방 친해져서 즐겁게 놀아줬어요.' },
  { id: 5, date: '2025-08-11', rating: 4, author: { name: '지후맘', avatar: 'https://placehold.co/48x48/E0E7FF/3730A3?text=지' }, comment: '아이 특성을 빠르게 파악하고 그에 맞춰 놀아주셨어요.' },
  { id: 6, date: '2025-08-13', rating: 5, author: { name: '서준맘', avatar: 'https://placehold.co/48x48/FEF3C7/92400E?text=서' }, comment: '활발한 놀이로 아이가 즐거워했어요.' },
  { id: 7, date: '2025-08-15', rating: 4, author: { name: '민우맘', avatar: 'https://placehold.co/48x48/F3E8FF/581C87?text=민' }, comment: '아이 컨디션이 좋지 않아 조금 힘들었지만 괜찮았어요.' },
  { id: 8, date: '2025-08-17', rating: 5, author: { name: '태길맘', avatar: 'https://placehold.co/48x48/E1EFFE/1E40AF?text=태' }, comment: '놀이 진행이 차분하고 아이 눈높이에 맞춰주셨어요.' },
];

export default function UserReviewsPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopBar /> 
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <UserProfile user={mockUser} />
            
            <div className="mt-8">
              {/* 리뷰 카드 간의 세로 간격(gap-y)을 늘렸습니다. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {mockReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomFooter />
    </div>
  );
}