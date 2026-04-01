import { useEffect, useState } from "react";
import { getReportList } from "../../../api/admin/ReportApi";
import useCustomMove from "../../../hooks/useCustomMove";

const ListComponent = () => {
  const { page, size, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
  });

  useEffect(() => {
    getReportList({ page, size }).then((data) => {
      if (data) {
        setServerData(data);
      }
    });
  }, [page, size]);

  return (
    <div className="notice-modify-container">
      <div className="notice-modify-title">신고 접수 목록</div>

      <table
        className="report-table"
        style={{ width: "100%", textAlign: "center" }}
      >
        <thead>
          <tr style={{ background: "#f8f9fa", height: "50px" }}>
            <th>번호</th>
            <th>유형</th>
            <th>대상자</th>
            <th>상태</th>
            <th>신고일</th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList && serverData.dtoList.length > 0 ? (
            serverData.dtoList.map((report) => (
              <tr
                key={report.reportId}
                onClick={() => moveToRead(report.reportId)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  height: "50px",
                }}
              >
                <td>{report.reportId}</td>
                <td>{report.reportType || "유형 없음"}</td>
                <td>{report.targetMemberId || "대상 없음"}</td>
                <td>{report.status === 0 ? "접수" : "처리완료"}</td>
                <td>
                  {report.regDate
                    ? new Date(report.regDate).toLocaleDateString()
                    : "날짜 정보 없음"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: "50px", color: "#ccc" }}>
                접수된 신고 내역이 존재하지 않습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListComponent;
