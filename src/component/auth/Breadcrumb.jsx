import React from 'react';
import { Link } from 'react-router-dom';

// --- SVG 아이콘 ---
const HomeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);


// --- 브레드크럼 컴포넌트 ---
export default function Breadcrumb({ paths = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <div className="flex items-center" style={{ color: '#999999' }}>
            <HomeIcon />
            <span className="sr-only">Home</span>
          </div>
        </li>

        {/* props로 받은 경로들을 렌더링 */}
        {paths.map((path, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRightIcon className="w-4 h-4 text-gray-300" />
            {index === paths.length - 1 ? (
              <span className="font-semibold whitespace-nowrap" style={{ color: '#FEAA45' }} aria-current="page">
                {path.name}
              </span>
            ) : (
              <span className="whitespace-nowrap" style={{ color: '#999999' }}>
                {path.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
