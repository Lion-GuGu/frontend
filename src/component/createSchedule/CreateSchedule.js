import React, { useState } from "react";
import styles from "./createSchedule.module.css";

function CreateSchedule() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("긴급");
  const [date, setDate] = useState("2025-08-26");
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("13:00");
  const [location, setLocation] = useState("");
  const [info, setInfo] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    // 저장 로직 예: 서버 전송 또는 상태 관리
    console.log({
      title,
      category,
      date,
      startTime,
      endTime,
      location,
      info,
      description,
      tags,
    });
    alert("일정이 저장되었습니다!");
  };

  const handleCancel = () => {
    // 초기화
    setTitle("");
    setCategory("긴급");
    setDate("2025-08-26");
    setStartTime("11:00");
    setEndTime("13:00");
    setLocation("");
    setInfo("");
    setDescription("");
    setTags("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>일정 생성</h1>

      <label>제목 추가</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />

      <label>카테고리</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>긴급</option>
        <option>돌봄</option>
        <option>교육</option>
        <option>기타</option>
      </select>

      <label>날짜</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label>시간</label>
      <div className={styles.timeInputs}>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <span>~</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <label>장소</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="장소를 입력하시오"
      />

      <label>성별 | 나이</label>
      <input
        type="text"
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        placeholder="예: 남 | 30세"
      />

      <label>설명</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명을 입력하세요"
      ></textarea>

      <label>태그</label>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="예: 촉감놀이"
      />

      <div className={styles.btnGroup}>
        <button onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
        <button onClick={handleSave} className={styles.saveBtn}>
          Save
        </button>
      </div>
    </div>
  );
}

export default CreateSchedule;
