import axios from "axios";

const BASE_URL = "http://임시주소:8080"; // 나중에 실제 API 주소로 변경

export const fetchEvents = async (start, end) => {
  try {
    const res = await axios.get(`${BASE_URL}/events`, {
      params: {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
      },
    });
    return res.data;
  } catch (err) {
    console.error("일정 불러오기 실패", err);
    return [];
  }
};

export const addEventAPI = async (event) => {
  try {
    const res = await axios.post(`${BASE_URL}/events`, event);
    return res.data;
  } catch (err) {
    console.error("일정 등록 실패", err);
    return null;
  }
};

export const updateEventAPI = async (event) => {
  try {
    const res = await axios.put(`${BASE_URL}/events/${event.id}`, event);
    return res.data;
  } catch (err) {
    console.error("일정 수정 실패", err);
    return null;
  }
};

export const deleteEventAPI = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/events/${id}`);
    return res.data;
  } catch (err) {
    console.error("일정 삭제 실패", err);
    return null;
  }
};
