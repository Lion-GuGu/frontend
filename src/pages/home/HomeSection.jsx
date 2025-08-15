import TodayRecommendations from "../../component/home/TodayRecommendations";
import SchedulePanel from "../../component/home/SchedulePanel";
import { todayList, mySchedule } from "../../db/homeData";


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