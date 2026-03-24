import React, { useState } from "react";
import { postAdd } from "../../api/admin/CodeGroupApi";
import useCustomMove from "../../hooks/useCustomMove";
import "./AddComponent.css";
import { useNavigate } from "react-router";

const AddComponent = () => {
  const [codeGroup, setCodeGroup] = useState({
    //groupCode: "",
    groupName: "",
    useYn: "Y",
    enabled: 1,
  });

  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 함수형 업데이트로 안전하게 상태 변경
    setCodeGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickAdd = () => {
    postAdd(codeGroup)
      .then((data) => {
        alert("새로운 그룹코드가 등록되었습니다!");
        nav("/admin/codegroup/list", { replace: true });
      })
      .catch((err) => {
        // 에러 내용을 구체적으로 확인하기 위해 로그 출력
        console.error("서버 응답 에러:", err.response);
        alert(
          "등록 실패! 원인: " +
            (err.response?.data?.message || "데이터 형식을 확인하세요."),
        );
      });
  };

  return (
    <div className="codegroup-add-wrapper">
      <div className="codegroup-add-container">
        <div className="codegroup-header">
          <h2 className="codegroup-title">
            <span className="codegroup-title-point">꿀템</span> 코드그룹 추가
          </h2>
        </div>

        <div className="codegroup-form-content">
          {/* 그룹 코드 입력 */}
          <div className="codegroup-form-group">
            <label>그룹 코드</label>
            <input
              name="groupCode"
              value={codeGroup.groupCode}
              onChange={handleChange}
              placeholder="예: BIZ_STATUS"
            />
          </div>

          {/* 그룹명 입력 */}
          <div className="codegroup-form-group">
            <label>그룹명</label>
            <input
              name="groupName"
              value={codeGroup.groupName}
              onChange={handleChange}
              placeholder="코드 그룹의 이름을 입력하세요"
            />
          </div>

          {/* 사용 여부 선택 */}
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
            onClick={handleClickAdd}
          >
            등록하기
          </button>
          <button
            className="codegroup-btn codegroup-cancle-btn"
            onClick={() => nav("/admin/codegroup/list")}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
