import React, { useEffect, useState } from "react";
import { getOne, deleteOne } from "../../api/admin/CodeGroupApi";
import { useNavigate } from "react-router";
import "./ReadComponent.css";

const initState = {
  groupCode: "",
  groupName: "",
  useYn: "",
  enabled: "",
  regDate: null,
};

const ReadComponent = ({ groupCode }) => {
  const [codeGroup, setCodeGroup] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getOne(groupCode).then((data) => {
      setCodeGroup(data);
    });
  }, [groupCode]);

  const handleDelete = () => {
    if (window.confirm("정말 이 꿀단지(코드)를 삭제하시겠습니까?")) {
      deleteOne(groupCode).then(() => {
        alert("삭제되었습니다.");
        navigate(`../admin/codegroup/list`);
      });
    }
  };

  if (!codeGroup) return <div>로딩 중...</div>;

  return (
    <div className="codegroupinfo-wrapper">
      <div className="codegroupinfo-container">
        {/* 상단 타이틀 및 버튼 */}
        <div className="codegroupinfo-header">
          <h2 className="codegroupinfo-title">그룹코드 상세 정보</h2>
          <div className="codegroupinfo-actions">
            <button
              className="codegroupinfo-btn modify"
              onClick={() => navigate(`/admin/codegroup/modify/${groupCode}`)}
            >
              수정하기
            </button>
            <button className="codegroupinfo-btn delete" onClick={handleDelete}>
              삭제하기
            </button>
            <button
              className="codegroupinfo-btn list"
              onClick={() => navigate(`/admin/codegroup/list`)}
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="codegroupinfo-details">
          <div className="codegroupinfo-row">
            <label>그룹 코드</label>
            <span>{codeGroup.groupCode}</span>
          </div>
          <div className="codegroupinfo-row">
            <label>그룹명</label>
            <span>{codeGroup.groupName}</span>
          </div>
          <div className="codegroupinfo-row">
            <label>사용 여부</label>
            <span
              className={`codegroupinfo-status ${codeGroup.useYn === "Y" ? "active" : "inactive"}`}
            ></span>
            {codeGroup.useYn === "Y" ? "사용 중" : "사용 안 함"}
          </div>
          <div className="codegroupinfo-row">
            <label>등록일</label>
            <span>
              {codeGroup.regDate ? codeGroup.regDate.split("T")[0] : "-"}
            </span>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ReadComponent;
