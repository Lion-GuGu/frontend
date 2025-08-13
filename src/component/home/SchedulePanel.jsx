// src/component/home/SchedulePanel.jsx
import { CareCard, SectionTitle } from "./_ui";

// 라벨 유틸 (TodayRecommendations와 동일)
function labelFor(date) {
  const d = new Date(date);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}
function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

export default function SchedulePanel({
  items = [],
  startDate = new Date(), // 필요하면 상위에서 지정 가능
  days = 4,               // 몇 일치 열을 보여줄지
}) {
  // 날짜별 열 구성
  const columns = Array.from({ length: days }, (_, i) => {
    const date = addDays(startDate, i);
    const label = labelFor(date);
    const colItems = items.filter((it) => (it.meta?.[0] || "").startsWith(label));
    return { key: label, label, items: colItems };
  });

  return (
    <section>
      <SectionTitle>내 일정</SectionTitle>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.key} className="space-y-4">
            <div className="text-sm font-semibold text-gray-600">{col.label}</div>
            {col.items.map((v, i) => (
              <CareCard key={`${col.key}-${i}`} title={v.title} meta={v.meta} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
