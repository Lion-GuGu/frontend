// src/pages/schedule/EventContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import {
  fetchEvents,
  addEventAPI,
  updateEventAPI,
  deleteEventAPI,
} from "../../lib/api";

const EventContext = createContext();

// 카테고리별 색상 매핑
const categoryColors = {
  긴급: "#f28b82",
  돌봄: "#f6bf26",
  교육: "#33b679",
  기타: "#8ab4f8",
  내일정: "#ED8611",
};

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);

  // 서버에서 일정 불러오기
  const loadEvents = async (start, end) => {
    try {
      const data = await fetchEvents(start, end);
      // 서버에서 가져온 데이터에 색상 적용
      const colored = data.map((e) => ({
        ...e,
        color: categoryColors[e.category] || "#8ab4f8",
      }));
      setEvents(colored);
    } catch (err) {
      console.error("일정 불러오기 실패", err);
      setEvents([]);
    }
  };

  // 일정 추가
  const addEvent = async (event) => {
    try {
      const saved = await addEventAPI(event);
      if (saved) {
        setEvents((prev) => [
          ...prev,
          { ...saved, color: categoryColors[saved.category] || "#8ab4f8" },
        ]);
      }
    } catch (err) {
      console.error("일정 추가 실패", err);
      return null;
    }
  };

  // 일정 수정
  const updateEvent = async (event) => {
    try {
      const updated = await updateEventAPI(event);
      if (updated) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === updated.id
              ? {
                  ...updated,
                  color: categoryColors[updated.category] || "#8ab4f8",
                }
              : e
          )
        );
      }
    } catch (err) {
      console.error("일정 수정 실패", err);
      return null;
    }
  };

  // 일정 삭제
  const deleteEvent = async (id) => {
    try {
      const deleted = await deleteEventAPI(id);
      if (deleted) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("일정 삭제 실패", err);
      return null;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        loadEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
