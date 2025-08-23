// src/pages/community/CreatePostPage.jsx
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';
import api from '../../lib/api';

// 한글 라벨 ↔︎ 서버 enum 매핑
const KOR2ENUM = {
  '질문': 'QUESTION',
  '자유': 'FREE',
  '중고나눔': 'MARKET',
};
const CATEGORY_OPTIONS = Object.keys(KOR2ENUM); // ['질문','자유','중고나눔']

function CreatePostSection() {
  const [categoryKor, setCategoryKor] = useState(''); // 사용자가 고르는 한글 라벨
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!categoryKor) return alert('카테고리를 선택해 주세요.'), false;
    if (!title.trim()) return alert('제목을 입력해 주세요.'), false;
    if (!content.trim()) return alert('내용을 입력해 주세요.'), false;
    return true;
  };

  const submitPost = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        category: KOR2ENUM[categoryKor], // ← 서버 enum으로 전송
      };
      const { data } = await api.post('/api/community/posts', payload);

      // 응답 예시: { "postId": 1 } (명세서 기준), 혹은 { "id": 1 }
      const id = data?.postId ?? data?.id;
      alert('게시글이 등록되었습니다.');
      if (id) navigate(`/community/${id}`, { replace: true });
      else navigate('/', { state: { tab: '커뮤니티' }, replace: true });
    } catch (err) {
      console.error('게시글 등록 실패:', err);
      const status = err?.response?.status;
      if (status === 401) alert('로그인이 필요합니다.');
      else alert('등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  // Ctrl+Enter로 등록
  const onEditorKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitPost();
    }
  };

  return (
    <main className="flex-grow bg-gray-50 py-10">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
          <h1 className="text-2xl font-bold">글쓰기</h1>
          <button
            onClick={submitPost}
            disabled={submitting}
            className="px-6 py-2 rounded-md text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#FEAA4580', color: '#A25F0D' }}
            title="Ctrl(⌘)+Enter 로도 등록할 수 있어요"
          >
            {submitting ? '등록 중...' : '등록'}
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* 카테고리 & 제목 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <select
                id="category"
                value={categoryKor}
                onChange={(e) => setCategoryKor(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold"
              >
                <option value="" disabled>카테고리</option>
                {CATEGORY_OPTIONS.map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>

              <div className="flex-grow border-l border-gray-300 ml-4 pl-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해 주세요."
                  className="w-full p-2 border-none outline-none focus:ring-0 text-sm"
                  maxLength={120}
                />
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <textarea
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={onEditorKeyDown}
              placeholder="내용을 입력하세요. (Ctrl/⌘ + Enter = 등록)"
              className="w-full p-2 border-none outline-none focus:ring-0 resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleChangeTab = useCallback(
    (next) => navigate('/', { state: { tab: next } }),
    [navigate]
  );
  const handleCalendarClick = useCallback(() => navigate('/calendar'), [navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <TopBar
        activeTab="커뮤니티"
        onChangeTab={handleChangeTab}
        onCalendarClick={handleCalendarClick}
      />
      <CreatePostSection />
      <BottomFooter />
    </div>
  );
}
