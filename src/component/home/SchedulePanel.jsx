
import { CareCard, SectionTitle } from "./_ui";

function labelFor(date) {
  const d = new Date(date);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

function addDays(base, n) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

export default function SchedulePanel({
  items = [],
  startDate = new Date(),
  days = 4,
}) {
  // 날짜별 열 구성
  const columns = Array.from({ length: days }, (_, i) => {
    const label = labelFor(addDays(startDate, i));
    const colItems = items.filter((it) =>
      (it.meta?.[0] || "").startsWith(label)
    );
    return { key: label, label, items: colItems };
  });

  return (
    <section>
      <SectionTitle>내 일정</SectionTitle>

      {/* TodayRecommendations와 동일한 그리드 → 카드 폭 통일 */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.key} className="space-y-4">
            <div className="text-sm font-semibold text-gray-600">{col.label}</div>

            {col.items.map((v, i) => (
              <CareCard
                key={`${col.key}-${i}`}
                title={v.title}
                meta={v.meta?.slice(1) ?? []} // 날짜(meta[0]) 제외
                badge={v.kind}                 // "요청" | "제공" 있으면 뱃지 표시
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
