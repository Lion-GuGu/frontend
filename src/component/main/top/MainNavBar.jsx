// src/components/home/top/MainNavBar.jsx
export default function MainNavBar({
  active = "홈",
  onChange,            // (tab:string) => void
  onCalendarClick,     // () => void
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
                {/* 배경/테두리 없는 탭: span 사용 */}
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
                    (isActive
                      ? "text-white font-semibold"
                      : "opacity-60 hover:opacity-100")
                  }
                >
                  {t}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="text-sm">📞 (054) 123-4567</div>
      </div>
    </div>
  );
}
