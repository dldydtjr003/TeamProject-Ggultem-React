import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Menu from "../../include/admin/Menu";
import ListComponent from "../../components/CodeGroup/ListComponent";

const ListPage = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();

  // 상세 페이지 이동 시 현재 검색 조건 유지
  const moveToRead = (groupCode) => {
    navigate({
      pathname: `admin/codeGroup/read/${groupCode}`,
      search: queryParams.toString(),
    });
  };

  // 등록 페이지 이동
  const moveToAdd = () => {
    navigate({ pathname: `../admin/codegroup/add` });
  };

  return (
    <div className="codegroupinfo-page-wrapper">
      <Menu />
      <main className="codegroupinfo-main-content">
        <div className="codegroupinfo-hero-section">
          <ListComponent moveToRead={moveToRead} moveToAdd={moveToAdd} />
        </div>
      </main>
    </div>
  );
};

export default ListPage;
