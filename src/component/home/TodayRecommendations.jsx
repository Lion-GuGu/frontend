import { CareCard, SectionTitle } from "./_ui";

// "8월 26일 (화)" 형태 라벨 생성
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

// meta[0]이 라벨("8월 26일 (화)")이면 그대로 매칭해서 분류
export default function TodayRecommendations({ items = [], startDate = new Date(), days = 4 }) {
  const columns = Array.from({ length: days }, (_, i) => {
    const date = addDays(startDate, i);
    const label = labelFor(date);
    const colItems = items.filter((it) => (it.meta?.[0] || "").startsWith(label));
    return { key: label, label, items: colItems };
  });

  return (
    <section>
      <SectionTitle>오늘의 추천 돌봄</SectionTitle>

      {/* 열 그리드: 카드 폭 = 열 너비 (두 섹션 동일 폭을 위해 동일 그리드 사용) */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.key} className="space-y-4">
            <div className="text-sm font-semibold text-gray-600">{col.label}</div>

            {/* 해당 날짜의 카드들 (없으면 비움) */}
            {col.items.map((v, i) => (
              <CareCard key={`${col.key}-${i}`} title={v.title} meta={v.meta} emphasis={v.emphasis} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
