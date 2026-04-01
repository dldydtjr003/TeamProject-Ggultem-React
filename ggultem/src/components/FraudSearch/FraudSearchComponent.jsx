import React, { useState, useRef } from "react";
import "./FraudSearchComponent.css";
import { getList } from "../../api/admin/BlackListApi";

const FraudSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const normalize = (str) => (str || "").trim().toLowerCase();

  const handleSearch = async () => {
    const rawInput = inputRef.current?.value || "";
    const keyword = normalize(rawInput);

    if (!keyword) {
      alert("이메일을 정확히 입력해주세요.");
      return;
    }

    setLoading(true);
    setSearchResult(null);
    setHasSearched(false);

    try {
      const data = await getList({
        page: 1,
        size: 10,
        searchType: "e",
        keyword: rawInput, // 서버는 그대로 보내고
      });

      const now = new Date();

      // 🔥 1. 서버 결과를 무조건 배열로 안전 처리
      const list = Array.isArray(data?.dtoList) ? data.dtoList : [];

      // 🔥 2. 완전 일치 강제 (여기서 99% 차단됨)
      const exactMatches = list.filter((item) => {
        const email = normalize(item?.email);
        return email === keyword;
      });

      // ❗ 여기서 걸러지면 끝 → "a" 입력 시 무조건 빈 배열

      if (exactMatches.length === 0) {
        setSearchResult(null);
        setHasSearched(true);
        return;
      }

      // 🔥 3. 상태 + 기간 체크
      const validUser = exactMatches.find((item) => {
        const isExpired = item.endDate && new Date(item.endDate) < now;

        return item.status === "Y" && !isExpired;
      });

      setSearchResult(validUser || null);
      setHasSearched(true);
    } catch (error) {
      console.error("조회 실패:", error);
      alert("조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fraud-container">
      {/* 검색바 */}
      <div className="fraud-search-bar">
        <input
          ref={inputRef}
          className="fraud-search-input"
          type="text"
          placeholder="이메일 전체 주소를 입력하세요"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="fraud-search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "..." : "🔍"}
        </button>
      </div>

      {/* 결과 */}
      <div className={`fraud-result-card ${searchResult ? "danger" : ""}`}>
        {!hasSearched ? (
          <div className="placeholder-text">
            이메일을 입력하고 검색해주세요.
          </div>
        ) : searchResult ? (
          <div className="danger-content">
            <div className="icon-danger">⚠️</div>
            <h2 className="title-danger">블랙리스트 등록 사용자입니다.</h2>
            <table className="fraud-table">
              <tbody>
                <tr>
                  <th>이메일</th>
                  <td>{searchResult.email}</td>
                </tr>
                <tr>
                  <th>사유</th>
                  <td>{searchResult.reason}</td>
                </tr>
                <tr>
                  <th>시작일</th>
                  <td>{searchResult.startDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <th>종료일</th>
                  <td>
                    {searchResult.endDate
                      ? searchResult.endDate.split("T")[0]
                      : "영구"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="safe-content">
            <div className="icon-safe">🛡️</div>
            <h2 className="title-safe">일치하는 블랙리스트 정보가 없습니다.</h2>
            <p>
              "<b>{inputRef.current?.value}</b>" 와(과) 정확히 일치하는 이메일이
              없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudSearch;
