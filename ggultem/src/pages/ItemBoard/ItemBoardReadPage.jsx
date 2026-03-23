import "./ItemBoardReadPage.css"; // CSS 파일 임포트
import ItemBoardRead from "../../components/ItemBoard/ItemBoardReadComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const ItemBoardListPage = () => {
  return (
    <div className="itemBoardRead-page-wrapper">
      <Header />
      <main className="itemBoardRead-main-content">
        <ItemBoardRead />
      </main>
      <Footer />
    </div>
  );
};

export default ItemBoardListPage;
