import TodayRecommendations from "../../component/home/TodayRecommendations";
import SchedulePanel from "../../component/home/SchedulePanel";

// 👇 더미 데이터는 그대로 사용 가능 (meta[0]에 날짜 라벨 포함)
const todayList = [
  { title: "관리형 보조자 대기 돌봄", meta: ["8월 16일 (토)", "장소: 경북대", "시간: 10:00~"] },
  { title: "초등학생 대리 돌봄", meta: ["8월 13일 (수)", "장소: 금오공대", "시간: 09:00~"] },
  { title: "아이 돌봄", meta: ["8월 14일 (목)", "장소: 101동 207호", "시간: 12:00~"] },
  { title: "등하교 도우미", meta: ["8월 15일 (금)", "장소: 203동 201호", "시간: 15:00~"] },
  { title: "학원 데려다 주기", meta: ["8월 15일 (금)", "장소: 103동 203호", "시간: 19:00~"] },
  { title: "학원에서 데리고 오기", meta: ["8월 14일 (목)", "장소: 207동 112호", "시간: 13:00~"] },
  { title: "초등 저녁 식사 챙김", meta: ["8월 14일 (목)", "인원: 1명", "아이연령: 초등", "연락 필수"] },
  // 필요한 만큼 추가
];

const mySchedule = [
  { title: "아이 하원 후 임시 돌봄 요청", meta: ["8월 14일 (목)", "시간: 16:00~", "장소: 분수대 앞"] },
  { title: "아침 등원 도움 돌봄 요청", meta: ["8월 16일 (토)", "시간: 07:30~08:40", "장소: 송정초"] },
];

export default function HomeSection() {
  return (
    // ✅ 이 컴포넌트 자체도 세로 플렉스
    <div className="w-full flex-1 flex flex-col min-h-0">
      {/* 상단: 흰 배경 (오늘의 추천 돌봄) */}
      <section className="w-full bg-white">
        <div className="w-full px-4 md:px-8 py-10">
          <TodayRecommendations items={todayList} />
        </div>
      </section>

      {/* 하단: 회색 배경을 시작해서 푸터까지 채움 */}
      <section className="w-full bg-gray-100 flex-1">
        <div className="w-full px-4 md:px-8 py-10">
          <SchedulePanel items={mySchedule} />
          {/* 필요하면 여기 아래로 섹션을 더 이어붙여도 회색 유지 */}
        </div>
      </section>
    </div>
  );
}