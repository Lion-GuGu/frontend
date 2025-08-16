import React from 'react';

export default function LocationLoginBar({ locationText }) {
  return (
    <div className="w-full px-4 md:px-8 py-2 flex items-center justify-between text-xs text-gray-500">
      <div>{locationText}</div>

      <nav className="space-x-4 [&>a]:!text-gray-600 [&>a:visited]:!text-gray-600 [&>a:hover]:!text-gray-800 [&>a:hover]:underline [&>a:focus]:!text-gray-800 [&>a:active]:!text-gray-800">
        <a href="/login">로그인</a>
        <span className="text-gray-300">/</span>
        <a href="/register">회원가입</a>
      </nav>
    </div>
  );
}
