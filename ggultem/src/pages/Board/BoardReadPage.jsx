import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOne, API_SERVER_HOST } from "../../api/BoardApi";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import BoardRead from "../../components/Board/BoardReadComponent";

const host = API_SERVER_HOST;

const ReadPage = () => {
  const { boardNo } = useParams();

  return (
    <div className="bd-board-read-wrapper">
      <Header />
      <main className="bd-board-read-content">
        <BoardRead boardNo={boardNo} />
      </main>
      <Footer />
    </div>
  );
};

export default ReadPage;
