import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adminList, removeReply } from "../../../api/admin/ItemBoardReplyApi";
import PageComponent from "../../common/PageComponent";
import "./AdminReplyComponent.css";

const AdminReplyComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  // URL 파라미터 추출
  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";
  const enabled = searchParams.get("enabled") || "all";

  // 데이터 로드: 원댓글/대댓글 구분 없이 전체를 가져와서 계층 구조로 표시
  useEffect(() => {
    const params = { page, size, searchType, keyword };
    if (enabled !== "all") {
      params.enabled = Number(enabled);
    }

    adminList(params).then((data) => {
      // 기존의 원댓글 필터링(!reply.parentReplyNo)을 제거하여 대댓글도 리스트에 포함시킵니다.
      setServerData(data);
    });
  }, [page, size, enabled, searchType, keyword]);

  // 페이지 이동
  const moveToList = (pageParam) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageParam.page);
    navigate({ search: params.toString() });
  };

  // 검색 실행 및 입력창 초기화
  const handleSearch = () => {
    const type = document.getElementById("searchType").value;
    const word = searchTerm.trim();
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    params.set("searchType", type);

    if (word) {
      params.set("keyword", word);
    } else {
      params.delete("keyword");
    }

    navigate({ search: params.toString() });
    setSearchTerm(""); // 검색 후 입력창 비우기
  };

  const handleEnabledChange = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("enabled", val);
    navigate({ search: params.toString() });
  };

  const handleClickDelete = (e, replyNo) => {
    e.stopPropagation();
    if (window.confirm("해당 댓글을 비활성화 하시겠습니까?")) {
      removeReply(replyNo).then(() => {
        alert("비활성화 되었습니다.");
        // 삭제 후 데이터 새로고침
        const params = { page, size, searchType, keyword };
        if (enabled !== "all") params.enabled = Number(enabled);
        adminList(params).then((data) => setServerData(data));
      });
    }
  };

  return (
    <div className="admin-main-wrapper">
      <div className="admin-content-box">
        <div className="admin-header">
          <h3 className="admin-title">
            댓글 관리 <span className="yellow-point">마스터</span>
          </h3>

          <div className="admin-search-bar">
            <select id="searchType" defaultValue={searchType}>
              <option value="all">전체</option>
              <option value="itemTitle">상품명</option>
              <option value="writer">작성자</option>
            </select>
            <input
              type="text"
              id="searchKeyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>

          <div className="admin-header-right">
            <select
              className="admin-status-select"
              value={enabled}
              onChange={handleEnabledChange}
            >
              <option value="all">전체 보기</option>
              <option value="1">활성 상태</option>
              <option value="0">비활성 상태</option>
            </select>

            <button
              className="yellow-btn"
              onClick={() => navigate("/admin/itemBoard/list")}
            >
              상품 관리 이동
            </button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>상품명</th>
              <th className="content-col">댓글 내용</th>
              <th>작성자</th>
              <th>등록일</th>
              <th>상태 관리</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((reply) => (
                <tr
                  key={reply.replyNo}
                  className={`admin-table-row ${reply.parentReplyNo ? "reply-child-row" : ""}`}
                  onClick={() => navigate(`/itemBoard/read/${reply.itemId}`)}
                >
                  <td className="num-td">{reply.replyNo}</td>
                  <td>{reply.itemTitle}</td>
                  <td className="text-left content-td">
                    <div className="reply-content-wrapper">
                      <span className={reply.enabled === 0 ? "text-muted" : ""}>
                        {reply.content}
                      </span>
                    </div>
                  </td>
                  <td className="writer-td">{reply.nickname}</td>
                  <td className="date-td">
                    {reply.regDate ? reply.regDate.split("T")[0] : "-"}
                  </td>
                  <td
                    className="action-td"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reply.enabled === 1 ? (
                      <button
                        className="btn-delete-status"
                        onClick={(e) => handleClickDelete(e, reply.replyNo)}
                      >
                        비활성하기
                      </button>
                    ) : (
                      <span className="status-label-disabled">비활성</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  해당 조건의 댓글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="admin-paging">
          <PageComponent serverData={serverData} moveToList={moveToList} />
        </div>
      </div>
    </div>
  );
};

export default AdminReplyComponent;
