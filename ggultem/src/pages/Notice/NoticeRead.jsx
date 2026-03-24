import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, API_SERVER_HOST } from "../../api/NoticeApi";
import useCustomMove from "../../hooks/useCustomMove";

const NoticeRead = () => {
  const { noticeId } = useParams();
  const { moveToNoticeList } = useCustomMove();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOne(noticeId)
      .then((data) => {
        console.log(data);
        setNotice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [noticeId]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (!notice) return <div className="error">데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="notice-read-container">
      {/* 1. 헤더 */}
      <div className="notice-read-header">
        <h2 className="notice-read-title">{notice.title || "제목 없음"}</h2>
        <div className="notice-read-meta">
          <span>작성자: 익명</span>
          <span>조회수: {notice.viewCount || 0}</span>
          <span>
            등록일:{" "}
            {notice.regDate ? notice.regDate.substring(0, 10) : "날짜 없음"}
          </span>
        </div>
      </div>

      {/* 2. 이미지 영역 (배열 처리) */}
      {notice.uploadFileNames && notice.uploadFileNames.length > 0 && (
        <div className="notice-read-images">
          {notice.uploadFileNames.map((imgName, i) => (
            <img
              key={i}
              src={`${API_SERVER_HOST}/admin/notice/view/${imgName}`}
              alt={`첨부이미지-${i + 1}`}
              className="notice-read-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ))}
        </div>
      )}

      {/* 3. 본문 내용 */}
      <div className="notice-read-content">
        {notice.content || "내용이 없습니다."}
      </div>

      {/* 4. 푸터(버튼) */}
      <div className="notice-read-footer">
        <button className="btn-back" onClick={() => moveToNoticeList()}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default NoticeRead;
