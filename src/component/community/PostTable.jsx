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

function colorFromString(str = '') {
  const palette = [
    'bg-gray-200 text-gray-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-amber-100 text-amber-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
  ];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}

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
  return p.views ?? p.viewCount ?? p.hit ?? 0;
}

export default function PostTable({ posts = [], userMap = {}, emptyMessage = '게시글이 없습니다.' }) {
  const rows = posts.map((p) => {
    const nameFromPost = extractAuthorNameFromPost(p);
    const id = extractAuthorId(p);
    const user = id != null ? userMap[String(id)] : undefined;
    const name =
      nameFromPost ||
      user?.name ||
      user?.username ||
      '익명';

    return {
      id: p.id ?? p.postId,
      category: CATEGORY_LABEL[p.category] || p.category || '-',
      title: p.title ?? '(제목 없음)',
      author: name,
      authorClass: colorFromString(name),
      date: fmtDate(p.createdAt || p.created_at || p.date),
      views: viewsOf(p),
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.authorClass}`}>
                    {post.author}
                  </span>
                </td>
                <td className="py-4 text-gray-500">{post.date}</td>
                <td className="py-4 text-gray-500">{post.views}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
