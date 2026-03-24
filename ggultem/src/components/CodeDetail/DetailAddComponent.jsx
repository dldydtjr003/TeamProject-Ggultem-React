import React, { useState, useEffect } from "react";
import { postDetailAdd } from "../../api/admin/CodeDetailApi";
import "./DetailAddComponent.css"; // CSS 임포트 잊지 마세요!

const DetailAddComponent = ({ groupCode, callbackFn }) => {
  const [detail, setDetail] = useState({
    groupCode: groupCode,
    codeValue: "",
    codeName: "",
    sortSeq: 1,
    useYn: "Y",
  });

  const handleChange = (e) => {
    setDetail({ ...detail, [e.target.name]: e.target.value });
  };

  const handleClickAdd = () => {
    if (!detail.codeValue || !detail.codeName) {
      alert("코드값과 코드명을 모두 입력해주세요!");
      return;
    }

    postDetailAdd(detail).then(() => {
      alert("상세 코드가 등록되었습니다.");
      // 등록 후 입력칸 초기화
      setDetail({
        groupCode: groupCode,
        codeValue: "",
        codeName: "",
        sortSeq: 1,
        useYn: "Y",
      });
      callbackFn();
    });
  };

  return (
    <div className="detail-add-wrapper">
      <h4 className="detail-add-title">➕ 새로운 상세 코드 추가</h4>

      <div className="detail-add-form">
        <div className="detail-add-group">
          <label>코드값</label>
          <input
            className="detail-add-input"
            name="codeValue"
            value={detail.codeValue}
            placeholder="예: GNG"
            onChange={handleChange}
          />
        </div>

        <div className="detail-add-group">
          <label>코드명</label>
          <input
            className="detail-add-input"
            name="codeName"
            value={detail.codeName}
            placeholder="예: 강남구"
            onChange={handleChange}
          />
        </div>

        <button className="detail-add-btn" onClick={handleClickAdd}>
          🍯 꿀템 등록
        </button>
      </div>
    </div>
  );
};

export default DetailAddComponent;
