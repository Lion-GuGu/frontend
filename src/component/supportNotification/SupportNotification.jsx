import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationCard() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-sm w-[380px] ml-[-150px]">
      {/* 왼쪽 텍스트 */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => navigate("/reviews/honggildong")}
          className="font-bold text-gray-800 hover:underline"
        >
          홍길동
        </button>
        <span>님이 돌봄을 지원했어요~</span>
      </div>

      {/* 오른쪽 버튼 */}
      <div className="flex items-center space-x-3">
        <button className="text-red-500 font-bold hover:underline">거절</button>
        <div className="w-px h-5 bg-black"></div>
        <button className="text-blue-500 font-bold hover:underline">승인</button>
      </div>
    </div>
  );
}
