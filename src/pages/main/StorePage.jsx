import React from 'react';

// 아이콘 SVG
const WrenchScrewdriverIcon = ({ className = "w-16 h-16" }) => (
    <svg 
        className={className} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.878-5.878m0 0a2.25 2.25 0 10-3.182-3.182 2.25 2.25 0 003.182 3.182zM3 16.5v-1.5A2.25 2.25 0 015.25 12.75h1.5a2.25 2.25 0 012.25 2.25v1.5A2.25 2.25 0 016.75 18h-1.5A2.25 2.25 0 013 16.5z" 
        />
    </svg>
);


export default function StorePage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center bg-gray-50 p-8">
      <div className="text-gray-400">
        <WrenchScrewdriverIcon />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-700">
        기능 개발 중입니다.
      </h2>
      <p className="mt-2 text-gray-500">
        더 좋은 서비스를 제공하기 위해 열심히 준비하고 있습니다.
      </p>
    </div>
  );
}
