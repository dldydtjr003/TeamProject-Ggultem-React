import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply
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

  const loginState = useSelector(state => state.loginSlice);
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

  const parentReplies = replyList.filter(r => !r.parentReplyNo);
  const childReplies = replyList.filter(r => r.parentReplyNo);

  const handleAddReply = () => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("내용 입력");

    addReply({
      boardNo,
      content,
      email,
      parentReplyNo: null
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
      parentReplyNo: parentNo
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
    <div className="reply-wrapper">
      <h3>댓글</h3>

      {/* 댓글 입력 */}
      <div className="reply-input">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글 입력"
        />
        <button onClick={handleAddReply}>등록</button>
      </div>

      {/* 부모 댓글 */}
      {parentReplies.map((reply) => (
        <div key={reply.replyNo} className="reply-item">

          <div className="reply-main">
            <strong>{reply.writer}</strong>

            {modifyReplyNo === reply.replyNo ? (
              <>
                <textarea
                  value={modifyContent}
                  onChange={(e) => setModifyContent(e.target.value)}
                />
                <button onClick={() => handleModifySubmit(reply.replyNo)}>완료</button>
                <button onClick={() => setModifyReplyNo(null)}>취소</button>
              </>
            ) : (
              <div>
                {reply.enabled === 0 ? (
                  <div className="deleted">삭제된 댓글입니다</div>
                ) : (
                  <div>{reply.content}</div>
                )}
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

                </div>
              ))}
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