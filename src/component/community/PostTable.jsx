// src/component/community/PostTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_LABEL = {
  QUESTION: '질문',
  FREE: '자유',
  TIP: '팁',
  NOTICE: '공지',
  MARKET: '거래',
};

// ▼▼▼ 1. 이 함수를 HEX 색상 코드를 반환하도록 수정합니다. ▼▼▼
const getAuthorStyle = (user) => {
  // user 객체에 'points' 필드가 있다고 가정합니다.
  if (!user || user.points == null) {
    return { backgroundColor: '#E5E7EB', color: '#374151' }; // 기본 스타일
  }
  if (user.points >= 50) {
    return { backgroundColor: '#FFED9E', color: '#DB6E00' }; // 50점 이상
  } else {
    return { backgroundColor: '#9EFFB3', color: '#00A81C' }; // 50점 미만
  }
};

const fmtDate = (d) => {
  if (!d) return '-';
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? '-'
    : dt.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

function extractAuthorId(p) {
  return (
    p.authorId ??
    p.userId ??
    p.writerId ??
    p.createdById ??
    p.author?.id ??
    p.user?.id ??
    p.writer?.id ??
    p.createdBy?.id ??
    p.user_id ??
    null
  );
}

function extractAuthorNameFromPost(p) {
  return (
    p.author ||
    p.authorName ||
    p.authorNickname ||
    p.writer ||
    p.writerName ||
    p.writerNickname ||
    p.nickname ||
    p.name ||
    p.username ||
    p.userName ||
    p.author?.nickname ||
    p.author?.name ||
    p.author?.username ||
    p.user?.nickname ||
    p.user?.name ||
    p.user?.username ||
    p.createdBy?.nickname ||
    p.createdBy?.name ||
    p.createdBy?.username ||
    null
  );
}

function viewsOf(p) {
  const raw =
    p.viewCount ??
    p.views ??
    p.view_count ??
    p.hit ??
    p.readCount ??
    0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

const nfmt = new Intl.NumberFormat('ko-KR');

export default function PostTable({ posts = [], userMap = {}, emptyMessage = '게시글이 없습니다.' }) {
  const rows = posts.map((p) => {
    const nameFromPost = extractAuthorNameFromPost(p);
    const id = p.id ?? p.postId ?? p.postID ?? p.boardId;
    const userId = extractAuthorId(p);
    const user = userId != null ? userMap[String(userId)] : undefined;
    const name = nameFromPost || user?.name || user?.username || '익명';

    const v = viewsOf(p);

    return {
      id,
      category: CATEGORY_LABEL[p.category] || p.category || '-',
      title: p.title ?? '(제목 없음)',
      author: name,
      // ▼▼▼ 2. user 객체를 직접 넘겨주도록 변경합니다. ▼▼▼
      authorUserObject: user,
      date: fmtDate(p.createdAt || p.created_at || p.date),
      views: v,
      viewsText: nfmt.format(v),
    };
  });

  return (
    <div className="border-t-2 border-b-2 border-gray-200">
      <table className="w-full text-sm text-center table-fixed">
        <thead style={{ backgroundColor: '#DCE0E5' }}>
          <tr className="text-gray-600 font-semibold">
            <th className="py-3 w-[15%]">카테고리</th>
            <th className="py-3 w-[45%] text-center">제목</th>
            <th className="py-3 w-[15%]">작성자</th>
            <th className="py-3 w-[15%]">작성일</th>
            <th className="py-3 w-[10%] whitespace-nowrap">조회수</th>
          </tr>
        </thead>

        {rows.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={5} className="py-10 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="text-gray-800">
            {rows.map((post) => (
              <tr key={post.id} className="border-t border-gray-200">
                <td className="py-4">{post.category}</td>
                <td className="py-4 text-left pl-4">
                  <div className="max-w-full overflow-hidden">
                    <Link
                      to={`/community/${post.id}`}
                      className="hover:underline text-gray-900 block truncate"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  </div>
                </td>
                <td className="py-4">
                  {/* ▼▼▼ 3. className 대신 style을 사용하고 함수를 직접 호출합니다. ▼▼▼ */}
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={getAuthorStyle(post.authorUserObject)}
                  >
                    {post.author}
                  </span>
                </td>
                <td className="py-4 text-gray-500">{post.date}</td>
                <td className="py-4 text-gray-500 tabular-nums">{post.viewsText}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}