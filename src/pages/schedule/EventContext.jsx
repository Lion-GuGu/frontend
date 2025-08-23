import { createContext, useState, useContext } from "react";

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

  const addEvent = (event) =>
    setEvents((prev) => [
      ...prev,
      {
        ...event,
        color: categoryColors[event.category] || "#8ab4f8", // 카테고리 색상 자동 부여
      },
    ]);

  const updateEvent = (updated) =>
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

  const deleteEvent = (id) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
