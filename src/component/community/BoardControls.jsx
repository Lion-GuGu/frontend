// src/component/community/BoardControls.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BoardControls({
  category = '전체',
  onCategoryChange = () => {},
  showWriteButton = true,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      <label className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">카테고리:</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="전체">전체</option>
          <option value="자유">자유</option>
          <option value="질문">질문</option>
          <option value="중고나눔">중고나눔</option>
        </select>
      </label>

      {showWriteButton && (
        <button
          onClick={() => navigate('/community/new')}
          className="px-4 py-2 rounded-md text-sm font-semibold"
          style={{ backgroundColor: '#FEAA4580', color: '#A25F0D' }}
        >
          ✏️ 글쓰기
        </button>
      )}
    </div>
  );
}
