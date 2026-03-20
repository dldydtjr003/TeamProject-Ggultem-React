import React from "react";
import "./MyPage.css"; // CSS 파일 임포트
import ModifyComponent from "../../components/MyPage/ModifyComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import { useSelector } from "react-redux";

const ModifyPage = () => {
  const email = useSelector((state) => state.loginSlice.email);
  return (
    <div className="mypage-page-wrapper">
      <Header />
      <main className="mypage-main-content">
        <ModifyComponent email={email} />
      </main>
      <Footer />
    </div>
  );
};

export default ModifyPage;
