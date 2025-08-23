import React, { useState } from "react";
import styles from "./scheduleModal.module.css";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const ScheduleModal = ({ slot, event, onClose, onAdd, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(event?.title || "");
  const [colorCategory, setColorCategory] = useState(event?.category || "긴급");
  const [startDate, setStartDate] = useState(format(slot.start, "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState(format(slot.start, "HH:mm"));
  const [endTime, setEndTime] = useState(format(slot.end, "HH:mm"));
  const [location, setLocation] = useState(event?.location || "");
  const [gender, setGender] = useState(event?.gender || "");
  const [age, setAge] = useState(event?.age || "");
  const [description, setDescription] = useState(event?.description || "");
  const [tags, setTags] = useState(event?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [selectedDate, setSelectedDate] = useState(slot.start);

  const addTag = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${startDate}T${endTime}:00`);

    const newEvent = {
      id: event?.id || Date.now(),
      title,
      start: startDateTime,
      end: endDateTime,
      category: colorCategory,
      location,
      gender,
      age,
      description,
      tags,
    };

    if (event) {
      onUpdate(newEvent);
    } else {
      onAdd(newEvent);
    }
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.title}>일정 생성</div>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <input
              type="text"
              className={styles.titleInput}
              placeholder="제목 추가"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.category}>
              {["긴급", "돌봄", "교육", "기타"].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.categoryBtn} ${
                    colorCategory === c ? styles.active : ""
                  }`}
                  onClick={() => setColorCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.iconWrapper}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 13H11V7h1.5v8z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles.dateTime}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                locale={ko}
                dateFormat="MM월 dd일 (EEEE)"
                customInput={
                  <div
                    className={styles.dateDisplay}
                    style={{ cursor: "pointer" }}
                  >
                    {format(selectedDate, "MM월 dd일 (EEEE)", { locale: ko })}
                  </div>
                }
              />

              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={styles.timeSelect}
              >
                {Array.from({ length: 24 }, (_, h) => {
                  const hour = h.toString().padStart(2, "0");
                  return (
                    <option key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>

              <span> - </span>

              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={styles.timeSelect}
              >
                {Array.from({ length: 24 }, (_, h) => {
                  const hour = h.toString().padStart(2, "0");
                  return (
                    <option key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.iconWrapper}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <input
              type="text"
              className={styles.locationInput}
              placeholder="장소를 입력하시오"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.iconWrapper}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles.patient}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">성별 선택</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
              <select value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">나이 선택</option>
                {Array.from({ length: 18 }, (_, i) => (
                  <option key={i} value={`${i + 1}살`}>
                    {i + 1}살
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.iconWrapper}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8l-5-5zM7 7h10v2H7V7zm6 12H7v-2h6v2zm4-4H7v-2h10v2zm0-4H7V9h10v2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles.descriptionSection}>
              <div className={styles.textEditorToolbar}>
                <button className={styles.toolbarBtn}>
                  <b>B</b>
                </button>
                <button className={styles.toolbarBtn}>
                  <i>i</i>
                </button>
                <button className={styles.toolbarBtn}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </button>
                <button className={styles.toolbarBtn}>T</button>
                <button className={styles.toolbarBtn}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M4 15.5h16v-2H4v2zm0-5h16v-2H4v2zm0-5h16V3H4v2z" />
                  </svg>
                </button>
                <button className={styles.toolbarBtn}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M4 15.5h16v-2H4v2zm0-5h16v-2H4v2zM4 5v2h16V5H4z" />
                  </svg>
                </button>
              </div>
              <textarea
                className={styles.descriptionInput}
                placeholder="설명 추가"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.iconWrapper}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.63 5.86c-1.17-1.17-3.07-1.17-4.24 0L12 7.25 10.61 5.86c-1.17-1.17-3.07-1.17-4.24 0C5.19 6.44 5 7.02 5 7.5c0 .48.19 1.06.57 1.44l5.36 5.36c.39.39 1.02.39 1.41 0l5.36-5.36c.38-.38.57-.96.57-1.44 0-.48-.19-1.06-.57-1.44z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles.tags}>
              <input
                type="text"
                placeholder="# 태그 추가"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={addTag}
                className={styles.tagInput}
              />
              <div className={styles.tagList}>
                {tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className={styles.removeTagBtn}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          {event && (
            <button className={styles.deleteBtn} onClick={handleDelete}>
              삭제
            </button>
          )}
          <button className={styles.cancelBtn} onClick={onClose}>
            취소
          </button>
          <button className={styles.confirmBtn} onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
