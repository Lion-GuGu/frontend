// src/component/home/_ui.js

export function SectionTitle({ children }) {
  return (
    <h2 className="mb-6 text-[22px] md:text-[26px] font-extrabold tracking-[-0.2px] text-[#111827]">
      {children}
    </h2>
  );
}

export function CareCard({
  title,
  meta = [],
  badge,
  emphasis = false,
  className = "",
}) {
  const { place, time, child, tags } = parseMeta(meta);

  // 뱃지 표기: prop 우선, 없으면 제목 안의 '요청/제공'으로 자동 추론
  const norm = (v) =>
    v === "요청" || v === "request"
      ? "request"
      : v === "제공" || v === "provide"
      ? "provide"
      : null;
  const auto = title.includes("요청")
    ? "request"
    : title.includes("제공")
    ? "provide"
    : null;
  const kind = norm(badge) ?? auto; // null이면 뱃지 없음
  const label = kind === "request" ? "요청" : kind === "provide" ? "제공" : "";
  const badgeCls =
    kind === "request"
      ? "bg-[#4F6DE6] text-white"
      : kind === "provide"
      ? "bg-[#FEAA45] text-white"
      : "";

  return (
    <article
      className={
        `rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
         hover:shadow-md hover:border-slate-300 transition ${className}
         ` + (emphasis ? " ring-1 ring-sky-200" : "")
      }
    >
      {/* 타이틀 + 뱃지 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[19px] md:text-[20px] font-bold tracking-[-0.2px] text-[#455266]">
          {title}
        </h3>
        {kind && (
          <span
            className={`inline-flex items-center rounded-full
                        px-3.5 py-1.5 text-[13.5px] md:text-[15px]
                        font-bold tracking-[-0.2px] shadow-sm ${badgeCls}`}
          >
            {label}
          </span>
        )}
      </div>

      <hr className="mt-3 mb-4 border-slate-200" />

      {/* 장소/시간/아이 */}
      <ul className="text-[14px] space-y-1.5">
        <li>
          <span className="text-[#455266] font-semibold">장소: </span>
          <span className="text-black font-bold">{place}</span>
        </li>
        <li>
          <span className="text-[#455266] font-semibold">시간: </span>
          <span className="text-black font-bold">{time}</span>
        </li>
        <li>
          <span className="text-[#455266] font-semibold">아이: </span>
          <span className="text-black font-bold">{child}</span>
        </li>
      </ul>

      {/* 태그: 테두리 없음 / #455266 / 배경 #F5F8FA / 살짝 크게 */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {tags.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-md bg-[#F5F8FA]
                         px-3 py-1.5 text-[13px] md:text-[14px] font-semibold
                         text-[#455266] leading-none"
            >
              <span className="mr-1.5">#</span>
              {t.replace(/^#\s*/, "")}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function parseMeta(meta = []) {
  const out = { place: "", time: "", child: "", tags: [] };
  for (const raw of meta) {
    const s = String(raw || "").trim();
    if (!s) continue;
    if (s.startsWith("#")) {
      out.tags.push(s);
      continue;
    }
    if (s.startsWith("장소:")) {
      out.place = s.replace(/^장소:\s*/, "");
      continue;
    }
    if (s.startsWith("시간:")) {
      out.time = s.replace(/^시간:\s*/, "");
      continue;
    }
    if (s.startsWith("아이:")) {
      out.child = s.replace(/^아이:\s*/, "");
      continue;
    }
  }
  return out;
}
