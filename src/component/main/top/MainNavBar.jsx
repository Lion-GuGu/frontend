// src/components/home/top/MainNavBar.jsx
export default function MainNavBar({
  active = "홈",
  onChange,
  onCalendarClick,
}) {
  const tabs = ["홈", "캘린더", "커뮤니티", "스토어", "우편함"];

  const handle = (t) => (e) => {
    e.preventDefault();
    if (t === "캘린더") onCalendarClick?.();
    else onChange?.(t);
  };

  return (
    <div className="w-full bg-neutral-800 text-white">
      <div className="w-full px-4 md:px-8 py-3 flex items-center justify-between">
        <ul className="flex gap-6 text-sm" role="tablist" aria-label="메인 내비게이션">
          {tabs.map((t) => {
            const isActive = active === t;
            return (
              <li key={t}>
                <span
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onClick={handle(t)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handle(t)(e);
                  }}
                  className={
                    "cursor-pointer select-none outline-none " +
                    (isActive ? "text-white font-semibold" : "opacity-60 hover:opacity-100")
                  }
                >
                  {t}
                </span>
              </li>
            );
          })}
        </ul>

        {/* ▶ 전화 아이콘 + 번호 (이모지 대신 SVG) */}
        <a
          href="tel:+82541234567"
          className="flex items-center gap-2
                    text-white visited:text-white hover:text-white
                    decoration-white hover:underline
                    focus:outline-none"
          aria-label="전화 걸기 (054) 123-4567"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25A2.25 2.25 0 0 0 21.75 19.5v-1.372c0-.52-.36-.97-.87-1.09l-4.5-1.125c-.33-.083-.68.01-.92.25l-1.18 1.178a12.06 12.06 0 0 1-5.34-5.343l1.178-1.177c.24-.24.333-.59.25-.92L7.462 3.852a1.125 1.125 0 0 0-1.09-.852H5A2.25 2.25 0 0 0 2.75 5.25v1.5z" />
          </svg>
          <span className="text-white">(054) 123-4567</span>
        </a>

      </div>
    </div>
  );
}
