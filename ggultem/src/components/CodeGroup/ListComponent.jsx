import React, { useEffect, useState } from "react";
import { getList } from "../../api/admin/CodeGroupApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useNavigate } from "react-router";
import PageComponent from "../common/PageComponent";
import "./ListComponent.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = ({ moveToRead, moveToAdd }) => {
  const { page, size, keyword, searchType, refresh, moveToCodeGroupList } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [codeSearchType, setCodeSearchType] = useState("all");
  const [codeKeyword, setCodeKeyword] = useState("");
  const nav = useNavigate();

  // fetchList 정의: query 객체 전체를 의존성에 넣어 경고 해결
  useEffect(() => {
    getList({ page, size, keyword, searchType })
      .then((data) => {
        setServerData(data);
      })
      .catch((err) => console.error("데이터 호출 에러:", err));
  }, [page, size, keyword, searchType, refresh]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 선택한 카테고리와 키워드를 가지고 이동
    moveToCodeGroupList({
      page,
      size,
      keyword: codeKeyword,
      searchType: codeSearchType,
    });
  };

  const handleReset = () => {
    setCodeKeyword(""); // 입력창 비우기
    setCodeSearchType("all");

    nav("/admin/codegroup/list");
  };

  return (
    <div className="codegroup-list-wrapper">
      <div className="codegroup-list-container">
        {/* 헤더 섹션 */}
        <div className="codegroup-header">
          <div className="title-group">
            <h2 className="codegroup-title">
              <span className="codegroup-title-point">꿀템</span> 코드그룹 관리
            </h2>
            <p className="codegroup-subtitle">
              꿀템 사이트의 코드그룹을 관리합니다.
            </p>
            <form className="codegroup-search-form" onSubmit={handleSearch}>
              <div className="codegroup-actions">
                <select
                  className="admin-search"
                  value={codeSearchType}
                  onChange={(e) => setCodeSearchType(e.target.value)}
                >
                  <option value="all">전체</option>
                  <option value="groupCode">그룹코드</option>
                  <option value="groupName">그룹명</option>
                </select>
                <input
                  type="text"
                  value={codeKeyword}
                  onChange={(e) => setCodeKeyword(e.target.value)}
                  placeholder="검색어를 입력하세요"
                />
                <button type="submit" className="search-btn-wide">
                  🍯 검색
                </button>
              </div>
            </form>
          </div>
          <div className="admin-btn-group">
            <button className="admin-btn reset-btn" onClick={handleReset}>
              목록 초기화
            </button>
            <button className="admin-btn add-btn" onClick={() => moveToAdd()}>
              코드 추가
            </button>
          </div>
        </div>

        <div className="codegroup-table-responsive">
          <table className="codegroup-table">
            <thead>
              <tr>
                <th className="codegroup-th-groupcode">그룹 코드</th>
                <th className="codegroup-th-groupname">그룹명</th>
                <th className="codegroup-th-useyn">사용 여부</th>
                <th className="codegroup-th-setting">관리</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((item) => (
                  <tr key={item.groupCode}>
                    <td className="codegroup-td-groupcode">{item.groupCode}</td>
                    <td className="codegroup-td-groupname">{item.groupName}</td>
                    <td className="codegroup-td-useyn">
                      <span
                        className={`status-dot ${item.useYn === "N" ? "inactive" : "active"}`}
                      ></span>
                      {item.useYn === "Y" ? "사용중" : "중단"}
                    </td>
                    <td>
                      <button
                        className="admin-btn biz-btn"
                        onClick={() =>
                          nav(`/admin/codegroup/read/${item.groupCode}`)
                        }
                      >
                        상세코드
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-list">
                    등록된 코드가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* 페이징 */}
          <div className="codegroup-pagination-wrapper">
            <PageComponent
              serverData={serverData}
              movePage={moveToCodeGroupList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
