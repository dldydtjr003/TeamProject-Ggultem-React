import React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../include/admin/Menu"; // Menu 임포트 확인!
import AddComponent from "../../components/CodeGroup/AddComponent";

const AddPage = () => {
  return (
    <div className="codegroupinfo-page-wrapper">
      <Menu />
      <main className="codegroupinfo-main-content">
        <div className="codegroupinfo-hero-section">
          {/* 상세 컴포넌트에 이메일 전달 */}
          <AddComponent />
        </div>
      </main>
    </div>
  );
};

export default AddPage;
