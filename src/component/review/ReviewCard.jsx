import React from 'react';

// --- SVG 아이콘 및 별점 컴포넌트 ---
const StarIcon = ({ filled }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.32 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

const Rating = ({ score }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < score} />
    ))}
  </div>
);

// --- 리뷰 카드 메인 컴포넌트 ---
export default function ReviewCard({ review }) {
  return (
    // 카드 자체의 배경, 그림자, 패딩을 제거했습니다.
    <div>
      <p className="text-sm text-gray-500 mb-2">({review.date})</p>
      <div className="flex items-center gap-3">
        <img src={review.author.avatar} alt={review.author.name} className="w-12 h-12 rounded-full" />
        <Rating score={review.rating} />
      </div>
      <div className="mt-3">
        <p className="font-bold text-gray-800">[{review.author.name}]</p>
        <p className="text-gray-700 mt-1">{review.comment}</p>
      </div>
    </div>
  );
}
