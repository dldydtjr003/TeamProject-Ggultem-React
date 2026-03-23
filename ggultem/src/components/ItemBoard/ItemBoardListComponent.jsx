import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ItemBoardListComponent.css";

const host = API_SERVER_HOST;

const ItemBoardList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL 파라미터에서 필터 값 추출
  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const keyword = searchParams.get("keyword") || "";
  const searchType = searchParams.get("searchType") || "all";

  // ✅ 추가된 필터 파라미터
  const statusFilter = searchParams.get("status") || "all"; // all, false, true
  const categoryFilter = searchParams.get("category") || "all";
  const locationFilter = searchParams.get("location") || "all";

  const [serverData, setServerData] = useState({ dtoList: [], totalCount: 0 });
  const [searchState, setSearchState] = useState({
    type: searchType,
    word: keyword,
  });

  // ✅ 필터 변경 시 호출되는 함수
  const handleFilterChange = (name, value) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // 필터 변경 시 1페이지로 이동
    params.set(name, value);
    navigate(`/itemBoard/list?${params.toString()}`);
  };

  useEffect(() => {
    // API 호출 시 필터 파라미터도 함께 전달 (백엔드에서 처리 필요)
    getList({
      page,
      size,
      keyword,
      searchType,
      status: statusFilter,
      category: categoryFilter,
      location: locationFilter,
    })
      .then((data) => {
        if (data) setServerData(data);
      })
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, [
    page,
    size,
    keyword,
    searchType,
    statusFilter,
    categoryFilter,
    locationFilter,
  ]);

  const handleChangeSearch = (e) => {
    setSearchState({ ...searchState, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("searchType", searchState.type);
    params.set("keyword", searchState.word.trim());
    navigate(`/itemBoard/list?${params.toString()}`);
  };

  return (
    <div className="board-list-container">
      <div className="board-header">
        <h2>🍯 꿀템 매물 목록</h2>
        <button
          className="write-btn"
          onClick={() => navigate("/itemBoard/Register")}
        >
          상품 등록
        </button>
      </div>

      {/* 검색 섹션 */}
      <div className="hero-section">
        <form className="search-form-wide" onSubmit={handleSearch}>
          <select
            name="type"
            className="search-type-select"
            value={searchState.type}
            onChange={handleChangeSearch}
          >
            <option value="all">전체조건</option>
            <option value="title">상품명</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            name="word"
            className="search-input-wide"
            placeholder="어떤 꿀템을 찾으시나요?"
            value={searchState.word}
            onChange={handleChangeSearch}
          />
          <button type="submit" className="search-btn-wide">
            검색
          </button>
        </form>

        {/* ✅ 추가된 필터 바 섹션 */}
        <div className="filter-bar">
          {/* 판매 상태 필터 */}
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="false">판매 중</option>
            <option value="true">판매 완료</option>
          </select>

          {/* 카테고리 필터 */}
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="all">모든 카테고리</option>
            <option value="electronics">전자제품</option>
            <option value="clothing">의류</option>
            <option value="sports">스포츠</option>
            <option value="books">도서</option>
            <option value="furniture">가구</option>
          </select>

          {/* 지역 필터 (자주 올라오는 지역 예시) */}
          <select
            className="filter-select"
            value={locationFilter}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="all">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="부산">부산</option>
          </select>

          <button
            className="filter-reset-btn"
            onClick={() => navigate("/itemBoard/list")}
          >
            필터 초기화
          </button>
        </div>
      </div>

      {/* 상품 그리드 (기존과 동일) */}
      <div className="item-grid">
        {serverData.dtoList?.length > 0 ? (
          serverData.dtoList.map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() =>
                navigate(
                  `/itemBoard/read/${item.id}?${searchParams.toString()}`,
                )
              }
            >
              <div className="item-image">
                {String(item.status) === "true" && (
                  <div className="sold-out-overlay">
                    <span>SOLD OUT</span>
                  </div>
                )}
                <img
                  src={
                    item.uploadFileNames?.length > 0
                      ? `${host}/itemBoard/view/s_${item.uploadFileNames[0]}`
                      : `${host}/itemBoard/view/default.jpg`
                  }
                  alt={item.title}
                  className={String(item.status) === "true" ? "img-dark" : ""}
                />
              </div>
              <div className="item-info">
                <div className="item-category">{item.category}</div>
                <div className="item-title">{item.title}</div>
                <div className="item-price">
                  {item.price?.toLocaleString()}원
                </div>
                <div className="item-footer">
                  <span>{item.location}</span>
                  <span>{item.regDate?.split("T")[0]}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">조건에 맞는 상품이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ItemBoardList;
