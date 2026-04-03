import React, { useEffect, useState } from "react";
import {
  getOne,
  putOne,
  deleteOne,
  getList,
} from "../../../api/admin/BlackListApi";

const initState = {
  blId: 0,
  email: "",
  reason: "",
  adminId: "",
  status: "",
  startDate: "",
  endDate: "",
};

const BlackListModal = ({ blId, callbackFn }) => {
  const [blackList, setBlackList] = useState({ ...initState });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blId) {
      getOne(blId).then((data) => {
        setBlackList({ ...data });
      });
    }
  }, [blId]);

  const handleChange = (e) => {
    setBlackList({ ...blackList, [e.target.name]: e.target.value });
  };

  // --- 💡 [수정됨] 내용 수정 버튼 핸들러 ---
  const handleClickModify = async () => {
    if (!window.confirm("내용을 수정하시겠습니까?")) return;

    setLoading(true);
    try {
      const now = new Date();
      let updatedStatus = blackList.status; // 기본은 기존 상태 유지

      // 1. 날짜 데이터 포맷팅 (T23:59:59 추가)
      const formattedEndDate = blackList.endDate
        ? blackList.endDate.includes("T")
          ? blackList.endDate
          : `${blackList.endDate}T23:59:59`
        : null;

      // 2. 💡 [핵심 로직] 종료일이 설정되어 있고, 현재 시간보다 이전인지 체크
      if (formattedEndDate) {
        const selectedDate = new Date(formattedEndDate);
        if (selectedDate < now) {
          // 종료일이 과거라면 차단 해제 상태(N)로 자동 변경
          updatedStatus = "N";
          alert(
            "설정하신 종료일이 현재 시간보다 이전이므로 차단이 해제(N) 상태로 변경됩니다.",
          );
        } else {
          // 종료일이 미래라면 다시 차단 상태(Y)로 유지/변경
          updatedStatus = "Y";
        }
      }

      const formattedData = {
        ...blackList,
        endDate: formattedEndDate,
        status: updatedStatus, // 보정된 상태값 적용
      };

      await putOne(formattedData);
      alert("성공적으로 수정되었습니다.");
      callbackFn(true); // 리스트 새로고침
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정에 실패했습니다. 입력값을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // --- 재차단/해제 토글 핸들러 ---
  const handleClickToggleStatus = async () => {
    const isActive = blackList.status === "Y";

    if (isActive) {
      if (window.confirm("정말 차단을 해제하시겠습니까?")) {
        setLoading(true);
        try {
          // 단순히 삭제(해제)만 하는 경우
          await deleteOne(blId);
          alert("차단이 해제되었습니다.");
          callbackFn(true);
        } catch (error) {
          alert("해제 실패");
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (window.confirm("이 사용자를 다시 차단하시겠습니까?")) {
        setLoading(true);
        try {
          // 중복 체크
          const searchResult = await getList({
            page: 1,
            size: 10,
            searchType: "e",
            keyword: blackList.email,
          });

          const alreadyActive = searchResult.dtoList?.some(
            (item) => item.email === blackList.email && item.status === "Y",
          );

          if (alreadyActive) {
            alert("이미 차단 중(Y)인 동일 이메일 기록이 존재합니다.");
            setLoading(false);
            return;
          }

          // 재차단 시 종료일 체크 (과거 날짜면 차단 불가)
          if (blackList.endDate && new Date(blackList.endDate) < new Date()) {
            alert(
              "과거의 날짜로는 다시 차단할 수 없습니다. 종료일을 수정해주세요.",
            );
            setLoading(false);
            return;
          }

          const updatedData = {
            ...blackList,
            status: "Y",
            endDate: blackList.endDate
              ? blackList.endDate.includes("T")
                ? blackList.endDate
                : `${blackList.endDate}T23:59:59`
              : null,
          };

          await putOne(updatedData);
          alert("다시 차단되었습니다.");
          callbackFn(true);
        } catch (error) {
          alert("재차단 실패");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const isActive = blackList.status === "Y";

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3 style={{ color: isActive ? "#E03131" : "#333", marginTop: 0 }}>
          블랙리스트 상세 ({isActive ? "차단 중" : "해제됨"})
        </h3>
        <hr />

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>EMAIL</label>
          <input
            style={{ ...modalStyles.input, backgroundColor: "#f8f9fa" }}
            type="text"
            value={blackList.email}
            readOnly
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>차단 사유</label>
          <textarea
            style={{ ...modalStyles.input, height: "80px", resize: "none" }}
            name="reason"
            value={blackList.reason || ""}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>관리자 ID</label>
          <input
            style={modalStyles.input}
            type="text"
            name="adminId"
            value={blackList.adminId || ""}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>종료일 설정</label>
          <input
            style={modalStyles.input}
            type="date"
            name="endDate"
            value={blackList.endDate ? blackList.endDate.split("T")[0] : ""}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.buttonArea}>
          <button
            onClick={handleClickModify}
            style={modalStyles.modifyBtn}
            disabled={loading}
          >
            {loading ? "처리 중..." : "내용 수정"}
          </button>
          <button
            onClick={handleClickToggleStatus}
            style={isActive ? modalStyles.deleteBtn : modalStyles.reBlockBtn}
            disabled={loading}
          >
            {isActive ? "차단 해제" : "다시 차단"}
          </button>
          <button
            onClick={() => callbackFn(false)}
            style={modalStyles.closeBtn}
            disabled={loading}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// ... modalStyles 객체는 기존과 동일
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "450px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
  formGroup: { marginBottom: "15px", display: "flex", flexDirection: "column" },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  buttonArea: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  modifyBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#228be6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  closeBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#adb5bd",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  deleteBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#495057",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  reBlockBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#E03131",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
  },
};

export default BlackListModal;
