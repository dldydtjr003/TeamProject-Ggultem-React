import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"; // useParams 추가
import { getOne, API_SERVER_HOST } from "../../api/ItemBoardApi"; // API 경로 확인
import "./ItemBoardReadComponent.css";

const host = API_SERVER_HOST;

const ItemBoardReadComponent = () => {
  const { id } = useParams(); // URL에서 /itemBoard/read/23 의 '23'을 가져옴
  const navigate = useNavigate();
  const [item, setItem] = useState(null); // 초기값 null

  useEffect(() => {
    if (id) {
      getOne(id)
        .then((data) => {
          console.log("상세 데이터:", data);
          setItem(data);
        })
        .catch((err) => {
          console.error("데이터 로딩 실패:", err);
          alert("존재하지 않는 상품입니다.");
          navigate("/itemBoard/list");
        });
    }
  }, [id, navigate]);

  // 데이터 로딩 중 처리
  if (!item) return <div className="loading">로딩 중...</div>;

  return (
    <div className="read-container">
      <div className="read-header">
        <button
          className="back-btn"
          onClick={() => navigate("/itemBoard/list")}
        >
          ← 목록으로
        </button>
        <h2>상품 상세 정보</h2>
      </div>

      <div className="read-content">
        {/* 이미지 영역 */}
        <div className="image-section">
          {item.uploadFileNames && item.uploadFileNames.length > 0 ? (
            item.uploadFileNames.map((fileName, idx) => (
              <img
                key={idx}
                src={`${host}/itemBoard/view/${fileName}`}
                alt={`product-${idx}`}
              />
            ))
          ) : (
            <img src={`${host}/itemBoard/view/default.jpg`} alt="default" />
          )}
        </div>

        {/* 정보 영역 */}
        <div className="info-section">
          <div className="info-row">
            <span className="label">판매자</span>
            <span className="value">
              {item.writer} ({item.email})
            </span>
          </div>
          <div className="info-row">
            <span className="label">카테고리</span>
            <span className="value">{item.category}</span>
          </div>
          <div className="info-row">
            <span className="label">제목</span>
            <span className="value title">{item.title}</span>
          </div>
          <div className="info-row">
            <span className="label">가격</span>
            <span className="value price">
              {item.price?.toLocaleString()}원
            </span>
          </div>
          <div className="info-row">
            <span className="label">거래 지역</span>
            <span className="value">{item.location}</span>
          </div>
          <div className="info-row description">
            <span className="label">상세 설명</span>
            <p className="value content">{item.content}</p>
          </div>

          <div className="read-footer">
            <span className="date">등록일: {item.regDate}</span>
            <div className="btn-group">
              <button
                className="edit-btn"
                onClick={() => navigate(`/itemBoard/modify/${id}`)}
              >
                수정
              </button>
              <button className="chat-btn">판매자와 채팅하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardReadComponent;
