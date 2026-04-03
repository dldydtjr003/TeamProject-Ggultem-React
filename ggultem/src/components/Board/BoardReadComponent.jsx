import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOne, API_SERVER_HOST, removeBoard } from "../../api/BoardApi";
import BoardReplyComponent from "./BoardReplyComponent";

// 🔥 추가
import useReport from "../../hooks/useReport";
import ReportModal from "../../common/ReportModal";

import "./BoardReadComponent.css";

const host = API_SERVER_HOST;

const BoardReadComponent = ({ boardNo }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  // 🔥 신고
  const { showModal, setShowModal, sendReport } = useReport();

  // 로그인 정보
  const loginState = useSelector(state => state.loginSlice);
  const email = loginState?.email;

  // 삭제
  const handleDelete = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    removeBoard(board.boardNo).then(() => {
      alert("삭제 완료");
      navigate("/board/list");
    });
  };

  useEffect(() => {
    if (boardNo) {
      getOne(Number(boardNo)).then((data) => {
        console.log(data);
        setBoard(data);
      });
    }
  }, [boardNo]);

  // 로딩 처리
  if (!board) return <div>Loading...</div>;

  // 🔥 신고 데이터 (게시글 기준)
  const targetData = {
    targetType: "게시판", // ⭐ 백엔드 맞춰
    targetNo: board.boardNo,
    targetMemberId: board.email,
  };

  return (
    <div className="board-read-wrapper">
      <div className="board-read-container">

        {/* 상단 제목 */}
        <div className="read-header">
          <h2 className="read-title">{board.title}</h2>
          <div className="read-info">
            <span>작성자: <strong>{board.writer}</strong></span>
            <span>조회수: {board.viewCount}</span>
          </div>
        </div>

        {/* 본문 */}
        <div className="read-content-area">
          <div
            className="read-text"
            dangerouslySetInnerHTML={{ __html: board.content }}
          />
        </div>

        {/* 🔥 신고 버튼 추가 */}
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => setShowModal(true)} className="btn-report">
            🚨 신고하기
          </button>
        </div>

        {/* 댓글 */}
        <BoardReplyComponent boardNo={boardNo} />

        {/* 버튼 */}
        <div className="read-actions">
          <button onClick={() => navigate("/board/list")}>
            목록으로
          </button>

          {email === board.email && (
            <button onClick={() => navigate(`/board/modify/${board.boardNo}`)}>
              수정
            </button>
          )}

          {email === board.email && (
            <button onClick={handleDelete}>
              삭제
            </button>
          )}
        </div>

        {/* 🔥 신고 모달 */}
        <ReportModal
          show={showModal}
          targetData={targetData}
          callbackFn={() => setShowModal(false)}
          submitFn={sendReport}
        />

      </div>
    </div>
  );
};

export default BoardReadComponent;