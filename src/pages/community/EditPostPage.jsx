// src/pages/community/EditPostPage.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../component/main/TopBar';
import BottomFooter from '../../component/main/BottomFooter';
import api from '../../lib/api';

// 서버 enum -> 한글 라벨
const ENUM2KOR = {
  QUESTION: '질문',
  FREE: '자유',
  TIP: '팁',
  NOTICE: '공지',
  MARKET: '중고나눔',
};

function EditPostSection() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [categoryKor, setCategoryKor] = useState(''); // 표시용(수정 불가)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) 기존 게시글 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const { data } = await api.get(`/api/community/posts/${postId}`);
        setTitle(data.title ?? '');
        setContent(data.content ?? '');
        setCategoryKor(ENUM2KOR[data.category] || data.category || '자유'); // 표시만
        setLoading(false);
      } catch (err) {
        console.error('게시글 정보 불러오기 실패:', err);
        alert('게시글 정보를 불러올 수 없습니다.');
        navigate(`/community/${postId}`);
      }
    };
    fetchPostData();
  }, [postId, navigate]);

  const validate = () => {
    if (!title.trim()) return alert('제목을 입력해 주세요.'), false;
    if (!content.trim()) return alert('내용을 입력해 주세요.'), false;
    return true;
  };

  // 2) 수정 저장 (명세서: PATCH 바디는 title, content만)
  const submitEdit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      await api.patch(`/api/community/posts/${postId}`, {
        title: title.trim(),
        content: content.trim(),
      }); // 204 No Content 예상
      alert('게시글이 수정되었습니다.');
      navigate(`/community/${postId}`, { replace: true });
    } catch (err) {
      console.error('게시글 수정 실패:', err);
      const status = err?.response?.status;
      if (status === 401) alert('권한이 없습니다. 다시 로그인해 주세요.');
      else if (status === 403) alert('이 게시글을 수정할 권한이 없습니다.');
      else alert('수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const onEditorKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitEdit();
    }
  };

  if (loading) {
    return (
      <main className="flex-grow bg-gray-50 py-10">
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          게시글 정보를 불러오는 중...
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-50 py-10">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
          <h1 className="text-2xl font-bold">글 수정</h1>
          <button
            onClick={submitEdit}
            disabled={submitting}
            className="px-6 py-2 rounded-md text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#FEAA4580', color: '#A25F0D' }}
            title="Ctrl(⌘)+Enter 로도 수정할 수 있어요"
          >
            {submitting ? '수정 중...' : '수정'}
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* 상단: 카테고리 표시 + 제목 입력 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              {/* 카테고리는 명세상 수정 불가 → 배지로 표시 */}
              <span className="px-3 py-1 text-sm font-semibold rounded-md bg-gray-100 text-gray-700 select-none">
                {categoryKor}
              </span>

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
              placeholder="내용을 입력하세요. (Ctrl/⌘ + Enter = 수정)"
              className="w-full p-2 border-none outline-none focus:ring-0 resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function EditPostPage() {
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
      <EditPostSection />
      <BottomFooter />
    </div>
  );
}
