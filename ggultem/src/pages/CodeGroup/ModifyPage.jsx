import React from "react";
import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/CodeGroup/ModifyComponent";
import Menu from "../../include/admin/Menu";
import "./ModifyPage.css";

const ModifyPage = () => {
  const { groupCode } = useParams();

  return (
    <div className="codegroupinfo-page-wrapper">
      <Menu />
      <main className="codegroupinfo-main-content">
        <div className="codegroupinfo-hero-section">
          <ModifyComponent groupCode={groupCode} />
        </div>
      </main>
    </div>
  );
};

export default ModifyPage;
