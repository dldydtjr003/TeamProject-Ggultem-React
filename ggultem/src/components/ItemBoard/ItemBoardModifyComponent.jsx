import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getOne, putOne, API_SERVER_HOST } from "../../api/ItemBoardApi";
import { getListByGroup } from "../../api/admin/CodeDetailApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import axios from "axios";
import "./ItemBoardModifyComponent.css";

const host = API_SERVER_HOST;

const initState = {
  id: 0,
  title: "",
  price: 0,
  content: "",
  category: "",
  location: "",
  uploadFileNames: [],
  status: "false",
};

const ItemBoardModifyComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginState } = useCustomLogin();
  const uploadRef = useRef();

  const [item, setItem] = useState({ ...initState });
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getOne(id).then((data) => {
      if (loginState.email !== data.email) {
        alert("수정 권한이 없습니다.");
        navigate(`/itemBoard/read/${id}`);
        return;
      }
      setItem(data);
      setFetching(false);
    });

    const pageParam = { page: 1, size: 100 };
    axios
      .get(`${host}/api/codegroup/list`, { params: pageParam })
      .then((res) => {
        const allGroups = res.data.dtoList || [];
        allGroups.forEach((group) => {
          const gCode = group.groupCode.toUpperCase();
          if (gCode.includes("ITEM_CATEGORY") || gCode.includes("ITEM_CAT")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) setCategories(data.dtoList);
            });
          }
          if (gCode.includes("ITEM_LOCATION") || gCode.includes("ITEM_LOC")) {
            getListByGroup(pageParam, group.groupCode).then((data) => {
              if (data?.dtoList) setLocations(data.dtoList);
            });
          }
        });
      })
      .catch((err) => console.error("그룹 목록 로드 실패:", err));
  }, [id, loginState.email, navigate]);

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickRemoveFile = (fileName) => {
    const updatedFiles = item.uploadFileNames.filter(
      (name) => name !== fileName,
    );
    setItem({ ...item, uploadFileNames: updatedFiles });
  };

  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("location", item.location);

    const statusToSend =
      item.status === "판매완료" || item.status === "true" ? "true" : "false";
    formData.append("status", statusToSend);

    for (let i = 0; i < item.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", item.uploadFileNames[i]);
    }

    setFetching(true);
    putOne(id, formData)
      .then(() => {
        setFetching(false);
        alert("상품 정보가 수정되었습니다.");
        navigate(`/itemBoard/read/${id}`);
      })
      .catch(() => {
        setFetching(false);
        alert("수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="modify-container">
      <div className="modify-form">
        <h2>상품 정보 수정</h2>
        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            type="text"
            value={item.title}
            onChange={handleChangeItem}
          />
        </div>
        <div className="form-group">
          <label>가격</label>
          <input
            name="price"
            type="number"
            value={item.price}
            onChange={handleChangeItem}
          />
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={item.category}
            onChange={handleChangeItem}
          >
            <option value="">선택하세요</option>
            {categories.map((code) => (
              <option key={code.codeValue} value={code.codeValue}>
                {code.codeName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>판매 상태</label>
          <div className="status-radio-group">
            <label>
              <input
                type="radio"
                name="status"
                value="false"
                checked={item.status === "판매중" || item.status === "false"}
                onChange={handleChangeItem}
              />{" "}
              판매 중
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="true"
                checked={item.status === "판매완료" || item.status === "true"}
                onChange={handleChangeItem}
              />{" "}
              판매 완료
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>거래 지역</label>
          <select
            name="location"
            value={item.location}
            onChange={handleChangeItem}
          >
            <option value="">지역 선택</option>
            {locations.map((code) => (
              <option key={code.codeValue} value={code.codeValue}>
                {code.codeName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={item.content}
            onChange={handleChangeItem}
            rows="5"
          ></textarea>
        </div>
        <div className="form-group">
          <label>이미지 추가</label>
          <input ref={uploadRef} type="file" multiple={true} accept="image/*" />
        </div>
        <div className="form-group">
          <label>기존 이미지 (클릭 시 삭제)</label>
          <div className="modify-image-list">
            {item.uploadFileNames.map((fileName, idx) => (
              <div
                key={idx}
                className="modify-image-item"
                onClick={() => handleClickRemoveFile(fileName)}
              >
                <img src={`${host}/itemBoard/view/s_${fileName}`} alt="item" />
                <div className="delete-overlay">삭제</div>
              </div>
            ))}
          </div>
        </div>
        <div className="modify-btn-group">
          <button
            className="modify-submit-btn"
            onClick={handleClickModify}
            disabled={fetching}
          >
            수정 완료
          </button>
          <button className="modify-cancel-btn" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardModifyComponent;
