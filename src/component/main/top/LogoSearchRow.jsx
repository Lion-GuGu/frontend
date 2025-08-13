import { useState } from "react";
import logo from "../../../assets/logo.svg";
import nameMark from "../../../assets/name.svg";

function IconButton({ ariaLabel, onClick, children }) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="inline-flex items-center justify-center cursor-pointer select-none p-0 m-0 hover:opacity-80 focus-visible:outline-none"
    >
      {children}
    </span>
  );
}

export default function LogoSearchRow({
  onSearch = () => {},
  cartTotal = "$57.00",
  cartCount = 0, // 0이면 배지 숨김
}) {
  const [q, setQ] = useState("");

  return (
    <div className="w-full px-4 md:px-8 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
      {/* 로고 + 네임마크 (조금 크게) */}
      <div className="flex items-center gap-2 shrink-0">
        <img src={logo} alt="품아이 로고" className="h-9 w-9 md:h-10 md:w-10" />
        <img src={nameMark} alt="품아이" className="h-8 md:h-9" />
      </div>

      {/* 중앙 고정 검색 */}
      <form
        onSubmit={(e) => { e.preventDefault(); onSearch(q); }}
        className="justify-self-center w-full max-w-[640px] flex items-center"
      >
        <div className="relative flex-1">
          {/* 돋보기: 검정, 살짝 크게 */}
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="h-11 w-full rounded-l-xl border border-gray-300 pl-11 pr-3 outline-none focus:ring-2 focus:ring-[#FEAA45] focus:border-transparent"
          />
        </div>

        {/* 인풋과 완전히 연결 + 왼쪽 라운드 제거 */}
        <button
          type="submit"
          className="h-11 px-5 -ml-px !rounded-l-none !rounded-r-xl font-semibold text-white transition-none"
          style={{ backgroundColor: "#FEAA45" }}
        >
          검색
        </button>
      </form>

      {/* 우측 액션: 아이콘만 딱 보이게 */}
      <div className="justify-self-end flex items-center gap-2 shrink-0">
        <IconButton ariaLabel="관심">
          <svg className="h-6 w-6 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 8.25c0-2.5-2.1-4.5-4.7-4.5a4.7 4.7 0 0 0-3.3 1.35L12 6.1l-1-.95A4.7 4.7 0 0 0 7.7 3.75C5.1 3.75 3 5.75 3 8.25 3 14.44 12 19.5 12 19.5s9-5.06 9-11.25z" />
          </svg>
        </IconButton>

        {/* 구분선 더 가깝게 */}
        <span className="h-5 w-px bg-gray-300 mx-1" />

        <div className="flex items-center gap-2">
          <IconButton ariaLabel="장바구니">
            <span className="relative inline-block">
              <svg className="h-6 w-6 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M7 7h10l1.5 13H5.5L7 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#A94F1B] text-white text-[11px] leading-5 text-center">
                  {cartCount}
                </span>
              )}
            </span>
          </IconButton>

          {/* 포인트 줄바꿈 */}
          <div className="flex flex-col leading-tight ml-1">
            <span className="text-gray-400 text-sm">포인트 점수:</span>
            <span className="text-black font-semibold">{cartTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
