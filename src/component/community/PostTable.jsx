import React from 'react';
import { Link } from 'react-router-dom';

export default function PostTable({ posts }) {
    return (
        <div className="border-t-2 border-b-2 border-gray-200">
            <table className="w-full text-sm text-center">
                <thead style={{ backgroundColor: '#DCE0E5' }}>
                    <tr className="text-gray-600 font-semibold">
                        <th className="py-3 w-[15%]">카테고리</th>
                        <th className="py-3 w-[45%] text-center">제목</th>
                        <th className="py-3 w-[15%]">작성자</th>
                        <th className="py-3 w-[15%]">작성일</th>
                        <th className="py-3 w-[10%] whitespace-nowrap">조회수</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800">
                    {posts.map(post => (
                        <tr key={post.id} className="border-t border-gray-200">
                            <td className="py-4">{post.category}</td>
                            <td className="py-4 text-left pl-4">
                                {/* 게시글 제목(Link)의 색상을 검은색으로 강제합니다. */}
                                <Link to={`/community/${post.id}`} className="hover:underline !text-black">
                                    {post.title}
                                </Link>
                            </td>
                            <td className="py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.authorColor}`}>
                                    {post.author}
                                </span>
                            </td>
                            <td className="py-4 text-gray-500">{post.date}</td>
                            <td className="py-4 text-gray-500">{post.views}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
