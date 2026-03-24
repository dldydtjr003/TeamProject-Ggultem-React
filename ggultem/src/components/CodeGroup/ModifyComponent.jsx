import React, { useEffect, useState } from "react";
import { getOne, putOne } from "../../api/admin/CodeGroupApi";
import { useNavigate } from "react-router";
import "./ModifyComponent.css";

const initState = {
  groupCode: "",
  groupName: "",
  useYn: "",
  enabled: "",
  regDate: null,
};

const ModifyComponent = ({ groupCode }) => {
  const [codeGroup, setCodeGroup] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getOne(groupCode).then((data) => {
      setCodeGroup(data);
    });
  }, [groupCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCodeGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickModify = () => {
    putOne(codeGroup).then(() => {
      alert("수정되었습니다.");
      navigate(`/admin/codegroup/read/${groupCode}`);
    });
  };

  return (
    <div className="codegroupinfo-wrapper">
      <div className="codegroupinfo-container">
        {/* 상단 타이틀 및 버튼 */}
        <div className="codegroupinfo-header">
          <h2 className="codegroupinfo-title">그룹코드 수정</h2>
        </div>
        <div className="codegroup-form-content">
          <div className="codegroup-form-group">
            <label>그룹 코드</label>
            <span>{codeGroup.groupCode}</span>
          </div>
          <div className="codegroup-form-group">
            <label>그룹명</label>
            <input
              name="groupName"
              value={codeGroup.groupName}
              onChange={handleChange}
            />
          </div>
          <div className="codegroup-form-group">
            <label>사용 여부</label>
            <select
              name="useYn"
              value={codeGroup.useYn}
              onChange={handleChange}
            >
              <option value="Y">사용함</option>
              <option value="N">사용 안 함</option>
            </select>
          </div>
        </div>
        {/* 버튼 영역을 별도로 분리 */}
        <div className="codegroup-button-group">
          <button
            className="codegroup-btn codegroup-register-btn"
            onClick={handleClickModify}
          >
            수정하기
          </button>
          <button
            className="codegroup-btn codegroup-cancle-btn"
            onClick={() => navigate(`/admin/codegroup/read/${groupCode}`)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyComponent;
