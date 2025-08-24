// src/component/community/PaginationAndSearch.jsx
import React from 'react';

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

// 부모로부터 props를 받아 사용합니다.
export default function PaginationAndSearch({
  currentPage,      // 현재 페이지 번호 (0부터 시작)
  totalPages,       // 전체 페이지 수
  onPageChange,     // 페이지 변경을 처리할 함수
  searchQuery,      // 검색어
  onSearchChange,   // 검색어 입력을 처리할 함수
  onSearchSubmit,   // 검색 실행을 처리할 함수
}) {

  // 페이지 번호 버튼들을 렌더링하는 함수
  const renderPageNumbers = () => {
    if (totalPages === 0) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return pageNumbers.map(page => (
      <button
        key={page}
        // 부모로부터 받은 onPageChange 함수를 호출합니다. (API는 0부터 시작하므로 -1)
        onClick={() => onPageChange(page - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-md transition-colors !outline-none focus:!ring-0"
        style={{
          // 부모로부터 받은 currentPage와 비교하여 스타일을 결정합니다.
          backgroundColor: currentPage === page - 1 ? '#D9D9D9' : '#F2F2F2',
          color: currentPage === page - 1 ? 'black' : '#666666'
        }}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 페이지네이션 UI */}
      <div className="flex items-center gap-2 text-lg font-bold">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="w-10 h-10 flex items-center justify-center rounded-md !outline-none focus:!ring-0 disabled:text-gray-300"
          style={{ backgroundColor: '#F2F2F2', color: '#666666' }}
        >
          {'<'}
        </button>
        
        {renderPageNumbers()}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="w-10 h-10 flex items-center justify-center rounded-md !outline-none focus:!ring-0 disabled:text-gray-300"
          style={{ backgroundColor: '#F2F2F2', color: '#666666' }}
        >
          {'>'}
        </button>
      </div>

      {/* 검색 UI */}
      <form
        onSubmit={onSearchSubmit}
        className="justify-self-center w-full max-w-md"
      >
        <div
          className="flex w-full items-center h-11 rounded-xl border border-gray-300 bg-white transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#FEAA45]"
        >
          <div className="relative flex-1 h-full">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black"
            />
            <input
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="검색어를 입력하세요"
              className="w-full h-full rounded-l-xl border-none bg-transparent pl-10 pr-3 text-black outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-full flex-shrink-0 !rounded-l-none !rounded-r-xl !border-none !px-5 !py-0 font-semibold text-white transition-none focus:outline-none"
            style={{ backgroundColor: "#FEAA45" }}
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
}