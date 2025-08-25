// HomeSection.jsx

import React, { useState, useEffect } from 'react';
import api from '../../lib/api'; // api 유틸리티 import
import TodayRecommendations from "../../component/home/TodayRecommendations";
import SchedulePanel from "../../component/home/SchedulePanel";
// --- 모든 목업 데이터를 사용하지 않으므로 import 라인을 완전히 삭제합니다. ---

/**
 * API 응답 데이터를 컴포넌트가 사용할 수 있는 형태로 변환하는 함수
 */
const transformRequestsToScheduleItems = (requests = []) => {
  if (!requests || requests.length === 0) {
    return [];
  }

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const labelFor = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  };

  return requests.map(req => {
    const { title, date_only, start_time, end_time, category } = req;

    return {
      title: title,
      meta: [
        labelFor(date_only),
        `${start_time} - ${end_time}`,
      ],
      kind: category,
      // TodayRecommendations에서 사용하는 emphasis 속성도 필요하다면 추가할 수 있습니다.
      // 예: emphasis: category === 'EMERGENCY' ? '긴급' : null 
    };
  });
};


export default function HomeSection() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/requests');
        const transformedData = transformRequestsToScheduleItems(data);
        setScheduleItems(transformedData);
      } catch (error) {
        console.error("일정 데이터를 불러오는데 실패했습니다.", error);
        setScheduleItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {/* 상단: 흰 배경 (오늘의 추천 돌봄) */}
      <section className="w-full bg-white">
        <div className="w-full px-4 md:px-8 py-10">
          {/* --- `todayList` 대신 `scheduleItems`를 전달합니다. --- */}
          {loading ? (
            <div>추천 돌봄을 불러오는 중입니다...</div>
          ) : (
            <TodayRecommendations items={scheduleItems} />
          )}
        </div>
      </section>

      {/* 하단: 회색 배경을 시작해서 푸터까지 채움 */}
      <section className="w-full bg-gray-100 flex-1">
        <div className="w-full px-4 md:px-8 py-10">
          {loading ? (
            <div>일정을 불러오는 중입니다...</div>
          ) : (
            <SchedulePanel items={scheduleItems} />
          )}
        </div>
      </section>
    </div>
  );
}