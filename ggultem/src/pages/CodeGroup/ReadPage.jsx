import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ReadComponent from "../../components/CodeGroup/ReadComponent";
import DetailListComponent from "../../components/CodeDetail/DetailListComponent";
import DetailAddComponent from "../../components/CodeDetail/DetailAddComponent";
import Menu from "../../include/admin/Menu";
import "./ReadPage.css";

const ReadPage = () => {
  const { groupCode } = useParams(); // URL의 :groupCode 추출

  const [refresh, setRefresh] = useState(false);

  // 🔄 자식들이 호출할 새로고침 함수
  const changeRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div>
      <div className="codegroupinfo-page-wrapper">
        <Menu />
        <main className="codegroupinfo-main-content">
          <div className="codegroupinfo-hero-section">
            {/* 1. 그룹 상세 정보 (기존 기능 유지: 이동 함수 전달) */}
            <ReadComponent groupCode={groupCode} />
            {/* 2. 상세 코드 목록 (새 기능) */}
            <DetailListComponent
              groupCode={groupCode}
              changeRefresh={changeRefresh}
              refresh={refresh}
            />

            {/* 3. 새로운 상세 코드 등록 폼 (새 기능) */}
            <DetailAddComponent
              key={groupCode} // ✨ groupCode가 바뀌면 컴포넌트를 새로 생성함
              groupCode={groupCode}
              callbackFn={changeRefresh}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReadPage;
