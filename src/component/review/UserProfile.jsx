import React from 'react';

// 별점 아이콘 컴포넌트
const StarIcon = ({ filled }) => (
  <svg className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.32 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

// 별점 렌더링 컴포넌트
const Rating = ({ score }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < score} />
    ))}
  </div>
);

export default function UserProfile({ user }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto" />
        <p className="font-semibold mt-2" style={{ color: '#6A6A6A' }}>{user.name}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <Rating score={user.rating} />
          <span className="text-gray-600">리뷰점수 {user.rating}점</span>
          <span className="text-gray-400">|</span>
          <span 
            className="font-bold underline" 
            style={{ color: '#6A6A6A' }}
          >
            {user.reviewCount}개의 리뷰
          </span>
        </div>
        <p className="text-gray-500 mt-1">{user.address}</p>
      </div>
    </div>
  );
}
