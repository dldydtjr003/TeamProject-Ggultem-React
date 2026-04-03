import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply,
} from "../../api/BoardReplyApi";
import { useSelector } from "react-redux";

//  신고
import useReport from "../../hooks/useReport";
import ReportModal from "../../common/ReportModal";

import "./BoardReplyComponent.css";

const BoardReplyComponent = ({ boardNo }) => {
  const [replyList, setReplyList] = useState([]);
  const [content, setContent] = useState("");

  const [openReplyNo, setOpenReplyNo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const [modifyReplyNo, setModifyReplyNo] = useState(null);
  const [modifyContent, setModifyContent] = useState("");

  const loginState = useSelector((state) => state.loginSlice);
  const email = loginState?.email;

  //  신고 상태
  const { showModal, setShowModal, sendReport } = useReport();
  const [targetData, setTargetData] = useState(null);

  const loadReplies = () => {
    getReplyList(boardNo).then((data) => {
      setReplyList(data);
    });
  };

  useEffect(() => {
    loadReplies();
  }, [boardNo]);

  const parentReplies = replyList.filter((r) => !r.parentReplyNo);
  const childReplies = replyList.filter((r) => r.parentReplyNo);

  const handleAddReply = () => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("내용 입력");

    addReply({
      boardNo,
      content,
      email,
      parentReplyNo: null,
    }).then(() => {
      setContent("");
      loadReplies();
    });
  };

  const handleAddChildReply = (parentNo) => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!replyContent.trim()) return alert("내용 입력");

    addReply({
      boardNo,
      content: replyContent,
      email,
      parentReplyNo: parentNo,
    }).then(() => {
      setReplyContent("");
      setOpenReplyNo(null);
      loadReplies();
    });
  };

  const handleModify = (reply) => {
    setModifyReplyNo(reply.replyNo);
    setModifyContent(reply.content);
  };

  const handleModifySubmit = (replyNo) => {
    if (!modifyContent.trim()) return alert("내용 입력");

    modifyReply(replyNo, modifyContent).then(() => {
      setModifyReplyNo(null);
      setModifyContent("");
      loadReplies();
    });
  };

  const handleDelete = (replyNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    removeReply(replyNo).then(() => {
      loadReplies();
    });
  };


  const sendTargetData = (reply) => {
    setTargetData({
      targetType: "코멘트",
      targetNo: reply.replyNo,
      targetMemberId: reply.email,
    })
    console.log(targetData);
  }

  return (
    <div className="reply-container">
      <hr className="reply-divider" />
      <h3 className="reply-title">댓글 ({parentReplies.length})</h3>

      {/* 댓글 입력 */}
      <div className="reply-input-section">
        <textarea
          className="reply-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="따뜻한 댓글을 남겨주세요"
        />
        <div className="reply-btn-group">
          <button className="reply-submit-btn" onClick={handleAddReply}>
            등록
          </button>
        </div>
      </div>

      {/* 부모 댓글 */}
      <div className="reply-list">
        {parentReplies.map((reply) => (
          <div key={reply.replyNo} className="reply-item">
            <div className="reply-info">
              <span className="reply-writer">
                {/* == 0 으로 비교하여 타입 무시 */}
                {reply.enabled == 0
                  ? reply.writer
                  : reply.writer || reply.email}
              </span>
              <span className="reply-date">
                {reply.regDate ? reply.regDate.split(" ")[0] : "방금 전"}
              </span>
            </div>

            <div className="reply-content-box">
              {/* 1순위: 삭제된 댓글인지 확인 (Number로 강제 형변환 후 비교) */}
              {Number(reply.enabled) === 0 ? (
                <div className="reply-text deleted-text">
                  <span className="text-muted">🔒 삭제된 댓글입니다.</span>
                </div>
              ) : /* 2순위: 수정 모드인지 확인 */
              modifyReplyNo === reply.replyNo ? (
                <div className="modify-box">
                  <textarea
                    className="modify-textarea"
                    value={modifyContent}
                    onChange={(e) => setModifyContent(e.target.value)}
                  />
                  <div className="modify-btns">
                    <button onClick={() => handleModifySubmit(reply.replyNo)}>
                      완료
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setModifyReplyNo(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                /* 3순위: 평상시 내용 */
                <div className="reply-text">{reply.content}</div>
              )}
            </div>
            <div className="reply-actions">
              {Number(reply.enabled) === 1 && (
                <>
                  {email && (
                    <button onClick={() => setOpenReplyNo(reply.replyNo)}>
                      답글
                    </button>
                  )}
                  {reply.email === email && (
                    <>
                      <button onClick={() => handleModify(reply)}>수정</button>
                      <button onClick={() => handleDelete(reply.replyNo)}>
                        삭제
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* 대댓글 입력 */}
            {openReplyNo === reply.replyNo && (
              <div className="child-reply-input">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요"
                />
                <div className="child-reply-btns">
                  <button onClick={() => handleAddChildReply(reply.replyNo)}>
                    등록
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setOpenReplyNo(null)}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/*  신고 버튼 (본인 제외) */}
            {reply.enabled !== 0 && email && reply.email !== email && (
              <button
                onClick={() => {
                  sendTargetData(reply);
                  setShowModal(true);
                }}
              >
                🚨 신고
              </button>
            )}

            {reply.enabled !== 0 && email && (
              <button onClick={() => setOpenReplyNo(reply.replyNo)}>
                답글쓰기
              </button>
            )}

            {reply.enabled !== 0 && reply.email === email && (
              <>
                <button onClick={() => handleModify(reply)}>수정</button>
                <button onClick={() => handleDelete(reply.replyNo)}>삭제</button>
              </>
            )}
          </div>

          {/* 대댓글 입력 */}
          {openReplyNo === reply.replyNo && (
            <div className="child-input">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button onClick={() => handleAddChildReply(reply.replyNo)}>등록</button>
              <button onClick={() => setOpenReplyNo(null)}>취소</button>
            </div>
          )}

          {/* 대댓글 */}
          <div className="child-reply-list">
            {childReplies
              .filter(child => child.parentReplyNo === reply.replyNo)
              .map(child => (
                <div key={child.replyNo} className="child-reply">

                  <span className="reply-arrow">↳</span>

                  <div>
                    <strong>{child.writer}</strong>

                    {modifyReplyNo === child.replyNo ? (
                      <>
                        <textarea
                          value={modifyContent}
                          onChange={(e) => setModifyContent(e.target.value)}
                        />
                        <button onClick={() => handleModifySubmit(child.replyNo)}>완료</button>
                        <button onClick={() => setModifyReplyNo(null)}>취소</button>
                      </>
                    ) : (
                      <div>
                        {child.enabled === 0 ? "삭제된 댓글입니다" : child.content}
                      </div>
                    )}

                    {/*  대댓글 신고 (본인 제외) */}
                    {child.enabled !== 0 && email && child.email !== email && (
                      <button
                        onClick={() => {
                          sendTargetData(child);
                          setShowModal(true);
                        }}
                      >
                        🚨 신고
                      </button>
                    )}

                    {child.enabled !== 0 && child.email === email && (
                      <>
                        <button onClick={() => handleModify(child)}>수정</button>
                        <button onClick={() => handleDelete(child.replyNo)}>삭제</button>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>

        </div>
      ))}

      {/*  신고 모달 */}
      {targetData && (
        <ReportModal
          show={showModal}
          targetData={targetData}
          callbackFn={() => setShowModal(false)}
          submitFn={sendReport}
        />
      )}

    </div>
  );
};

export default BoardReplyComponent;
