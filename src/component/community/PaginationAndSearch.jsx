import React, { useState } from 'react';

const SearchIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

export default function PaginationAndSearch() {
    const [currentPage, setCurrentPage] = useState(1);
    const [q, setQ] = useState("");

    return (
        <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-lg font-bold">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(page => (
                    <button 
                        key={page} 
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10 flex items-center justify-center rounded-md transition-colors !outline-none focus:!ring-0"
                        style={{
                            backgroundColor: currentPage === page ? '#D9D9D9' : '#F2F2F2',
                            color: currentPage === page ? 'black' : '#666666'
                        }}
                    >
                        {page}
                    </button>
                ))}
                <button 
                    className="w-10 h-10 flex items-center justify-center rounded-md !outline-none focus:!ring-0" 
                    style={{backgroundColor: '#F2F2F2', color: '#666666'}}
                >
                    {'>'}
                </button>
            </div>
            
            <form
                onSubmit={(e) => { e.preventDefault();  }}
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
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
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