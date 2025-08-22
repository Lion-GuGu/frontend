import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./scheduleMonth.module.css";
import ScheduleModal from "../../component/cal/ScheduleModal";

const localizer = momentLocalizer(moment);

// 월 범위 문자열 포맷
function formatMonthRange(date) {
  const m = moment(date);
  return m.format("YYYY년 M월");
}

// 좌측 미니 먼슬리
function MiniMonth({ value, onChange }) {
  const m = moment(value);
  const start = moment(m).startOf("month").startOf("week");
  const end = moment(m).endOf("month").endOf("week");
  const days = [];
  const cursor = start.clone();

  while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
    days.push(cursor.clone());
    cursor.add(1, "day");
  }

  return (
    <div className={styles.miniMonth}>
      <div className={styles.miniMonthHeader}>
        <button
          className={styles.navBtn}
          onClick={() => onChange(moment(value).subtract(1, "month").toDate())}
        >
          ‹
        </button>
        <div className={styles.miniMonthTitle}>{m.format("YYYY년 M월")}</div>
        <button
          className={styles.navBtn}
          onClick={() => onChange(moment(value).add(1, "month").toDate())}
        >
          ›
        </button>
      </div>
      <div className={styles.miniMonthDows}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className={styles.dowCell}>
            {d}
          </div>
        ))}
      </div>
      <div className={styles.miniMonthGrid}>
        {days.map((d) => {
          const isToday = d.isSame(moment(), "day");
          const isOther = !d.isSame(m, "month");
          const isSelected = d.isSame(moment(value), "day");
          return (
            <button
              key={d.format("YYYY-MM-DD")}
              className={[
                styles.miniDay,
                isOther ? styles.otherMonth : "",
                isToday ? styles.today : "",
                isSelected ? styles.selected : "",
              ].join(" ")}
              onClick={() => onChange(d.toDate())}
            >
              <span>{d.date()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 이벤트 커스텀 렌더링 (색 동그라미 + 제목)
function CustomEvent({ event }) {
  return (
    <div className={styles.eventItem}>
      <span
        className={styles.eventDot}
        style={{ backgroundColor: event.color || "#8ab4f8" }}
      />
      <span className={styles.eventTitle}>{event.title}</span>
    </div>
  );
}

export default function ScheduleMonth() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slotForModal, setSlotForModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const timeContentRef = useRef(null);

  // 일정 추가
  const onSelectSlot = (slot) => {
    setSlotForModal({ start: slot.start, end: slot.end });
    setSelectedEvent(null);
    setModalOpen(true);
  };

  // 일정 클릭 → 수정/삭제 모달
  const onSelectEvent = (event) => {
    setSelectedEvent(event);
    setSlotForModal({ start: event.start, end: event.end });
    setModalOpen(true);
  };

  // 새 일정 추가
  const onAddEvent = (form) => {
    const saved = { ...form, id: Date.now() };
    setEvents((prev) => [...prev, saved]);
    setModalOpen(false);
  };

  // 일정 수정
  const onUpdateEvent = (form) => {
    setEvents((prev) => prev.map((e) => (e.id === form.id ? form : e)));
    setModalOpen(false);
  };

  // 일정 삭제
  const onDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalOpen(false);
  };

  const components = useMemo(
    () => ({
      toolbar: () => null,
      event: CustomEvent, // ✅ 이벤트 커스텀 컴포넌트 등록
    }),
    []
  );

  const formats = useMemo(
    () => ({
      dayFormat: (date) => moment(date).format("D"),
      weekdayFormat: (date) => moment(date).format("ddd"),
    }),
    []
  );

  return (
    <div className={styles.pageWrap}>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <img className={styles.logo} src="logo.svg" alt="로고" />
          <img className={styles.font} src="font.svg" alt="품아이" />
        </div>
        <MiniMonth value={date} onChange={setDate} />
        <div className={styles.calendarList}>
          <div className={styles.header}>
            <img className={styles.cal} src="cal.svg" alt="" />
            <div className={styles.sectionTitle}>단지 일정</div>
          </div>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#f28b82" }} />
            긴급
          </label>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#f6bf26" }} />
            돌봄
          </label>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#33b679" }} />
            교육
          </label>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#8ab4f8" }} />
            기타
          </label>
        </div>
        <div className={styles.calendarList}>
          <div className={styles.header}>
            <img className={styles.cal} src="cal.svg" alt="" />
            <div className={styles.sectionTitle}>내 일정</div>
          </div>
          <label className={styles.calItem}>
            <span className={styles.dot} style={{ background: "#ED8611" }} />내
            일정
          </label>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.leftControls}>
            <button
              className={styles.topBtn}
              onClick={() => setDate(new Date())}
            >
              오늘
            </button>
            <div className={styles.titleMonth}>{formatMonthRange(date)}</div>
          </div>
          <div className={styles.rightControls}>
            <div className={styles.viewSwitch}>월</div>
          </div>
        </div>

        <div className={styles.calendarHolder}>
          <Calendar
            localizer={localizer}
            date={date}
            view={Views.MONTH}
            onNavigate={setDate}
            selectable
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={onSelectSlot}
            onSelectEvent={onSelectEvent}
            style={{ height: "calc(100vh - 84px)" }}
            components={components}
            formats={formats}
          />
        </div>
      </main>

      {modalOpen && (
        <ScheduleModal
          slot={slotForModal}
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
          onAdd={onAddEvent}
          onUpdate={onUpdateEvent}
          onDelete={onDeleteEvent}
        />
      )}
    </div>
  );
}
