import React from 'react';
// TopBar와 BottomFooter는 실제 프로젝트 경로에 맞게 수정해주세요.
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';

// --- 글쓰기 페이지 메인 컨텐츠 ---
const CreatePostSection = () => {
    return (
        <main className="flex-grow bg-gray-50 py-10">
            <div className="w-full max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
                    {/* 1. '글쓰기' 폰트 크기를 줄였습니다. (text-2xl) */}
                    <h1 className="text-2xl font-bold">글쓰기</h1>
                    <button 
                        className="px-6 py-2 !border-none !outline-none rounded-md text-sm font-semibold"
                        style={{ backgroundColor: '#FEAA4580', color: '#A25F0D' }}
                    >
                        등록
                    </button>
                </div>

                {/* 2. 카테고리/제목과 내용 부분을 별도의 카드로 분리했습니다. */}
                <div className="mt-6 space-y-6">
                    {/* 카테고리 및 제목 입력 카드 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <select 
                                id="category" 
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold"
                            >
                                <option>카테고리</option>
                                <option>질문</option>
                                <option>자유</option>
                                <option>중고나눔</option>
                            </select>
                            <div className="flex-grow border-l border-gray-300 ml-4 pl-4">
                                <input 
                                    type="text" 
                                    placeholder="제목을 입력해 주세요." 
                                    className="w-full p-2 border-none outline-none focus:ring-0 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 내용 입력 카드 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <textarea 
                            rows="15"
                            placeholder="내용을 입력하세요."
                            className="w-full p-2 border-none outline-none focus:ring-0 resize-none text-sm"
                        ></textarea>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default function CreatePostPage() {
    return (
        <div className="w-full min-h-screen flex flex-col">
            <TopBar />
            <CreatePostSection />
            <BottomFooter />
        </div>
    );
}