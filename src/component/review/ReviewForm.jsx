import React, { useState } from "react";
import styles from "./reviewForm.module.css";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (!review.trim()) {
      alert("후기를 작성해 주세요");
      return;
    }
    alert(`별점: ${rating}, 리뷰: ${review}`);
    // TODO: 서버에 전송하는 로직 추가 가능
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>홍길동님의 돌봄은 어땠나요?</p>

      {/* 별점 */}
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`${styles.star} ${num <= rating ? styles.active : ""}`}
            onClick={() => setRating(num)}
          >
            <img src="star.svg" alt="별" />
          </span>
        ))}
      </div>

      {/* 리뷰 입력 */}
      <textarea
        className={styles.textarea}
        placeholder="후기를 작성해 주세요"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      {/* 버튼 */}
      <button className={styles.button} onClick={handleSubmit}>
        리뷰 게시
      </button>
    </div>
  );
}
