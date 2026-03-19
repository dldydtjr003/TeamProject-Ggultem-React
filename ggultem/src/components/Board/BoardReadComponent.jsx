import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOne, API_SERVER_HOST } from "../../api/BoardApi";

const host = API_SERVER_HOST;

const ReadPage = ({ boardNo }) => {
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);

  useEffect(() => {
    getOne(boardNo).then((data) => {
      console.log(data);
      setBoard(data);
    });
  }, [boardNo]);

  if (!board) return <div>Loading...</div>;

  return (
    <div className="board-read-wrapper">
      <div className="board-read-container">
        {/* 상단 제목 섹션 */}
        <div className="read-header">
          <h2 className="read-title">{board.title}</h2>
          <div className="read-info">
            <span className="read-writer">
              작성자: <strong>{board.writer}</strong>
            </span>
            <span className="read-views">조회수: {board.viewCount}</span>
          </div>
        </div>

        {/* 본문 내용 섹션 */}
        <div className="read-content-area">
          <p className="read-text">{board.content}</p>

          {/* 이미지 영역 */}
          <div className="read-image-gallery">
            {board.uploadFileNames?.map((file) => (
              <div className="read-image-box" key={file}>
                <img
                  src={`${host}/board/view/${file}`}
                  alt="게시글 이미지"
                  className="read-main-img"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 섹션 */}
        <div className="read-actions">
          <button className="btn-list" onClick={() => navigate("/board/list")}>
            목록으로 돌아가기
          </button>

          <button
            className="btn-modify"
            onClick={() => navigate(`/board/modify/${board.boardNo}`)}
          >
            수정하기 ✍️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
