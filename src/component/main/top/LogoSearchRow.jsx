import { useState } from "react";
import { Link } from 'react-router-dom';
import logo from "../../../assets/logo.svg";
import nameMark from "../../../assets/name.svg";
import SupportNotification from "../../supportNotification/SupportNotification"; 

function IconButton({ ariaLabel, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`
        !p-0 
        !border-none 
        !bg-transparent 
        !rounded-full
        cursor-pointer 
        inline-flex 
        items-center 
        justify-center 
        select-none 
        focus:!outline-none
        hover:opacity-80
        transition-opacity
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default function LogoSearchRow({
  onSearch = () => {},
  notificationCount = 5,
  onChangeTab,
}) {
  const [q, setQ] = useState("");
  const [showNotifications, setShowNotifications] = useState(false); // ✅ 알림창 토글 상태

  return (
    <div className="relative w-full px-4 md:px-8 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6 bg-white">
      {/* 로고 */}
      <Link
        to="/"
        className="flex items-center gap-2 shrink-0"
        onClick={() => onChangeTab?.("홈")}
      >
        <img src={logo} alt="품아이 로고" className="h-9 w-9 md:h-10 md:w-10" />
        <img src={nameMark} alt="품아이" className="h-8 md:h-9" />
      </Link>

      {/* 검색창 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(q);
        }}
        className="justify-self-center w-full max-w-[640px]"
      >
        <div className="flex w-full items-center h-11 rounded-xl border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#FEAA45]">
          <div className="relative flex-1 h-full">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full h-full rounded-l-xl border-none bg-transparent pl-11 pr-3 text-black outline-none"
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

      {/* 우측 알림 */}
      <div className="justify-self-end flex items-center gap-2.5 shrink-0 relative">
        <IconButton
          ariaLabel="알림 확인"
          className="relative"
          onClick={() => setShowNotifications((prev) => !prev)} // ✅ 토글
        >
          <svg
            className="h-7 w-7 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold">
              {notificationCount}
            </span>
          )}
        </IconButton>

        <div className="flex flex-col text-xs leading-tight text-left">
          <span className="text-gray-500">이웃과 나눌 시간</span>
          <span className="font-semibold text-black">15 온정</span>
        </div>

        {/* ✅ 알림창 */}
        {showNotifications && (
          <div className="absolute top-10 right-0 w-80 p-0 z-50"> 
            <SupportNotification
              nickname="홍길동"
              onReject={() => alert("거절")}
              onApprove={() => alert("승인")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
