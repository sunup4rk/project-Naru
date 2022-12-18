import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Write.scss';

const Detail = () => {
  const params = useParams()
  const navigate = useNavigate();
  const [detail, setDetail] = useState()

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:8080/detail/:id")
      .then((response) => {
          if(response.data.message === "로그인 성공") {
            setDetail()
          }
      })
    };
    fetchData();
  }, [])

  const onClickEdit = () => {
    navigate(`/community/edit/${params.id}`)
  }

  return (
    <>
    <div className="write">
      <div className="write-wrapper">
        제목<input type="text" defaultValue={"제목"}/>
        주소<input type="text" defaultValue={"주소"}/>
        상세주소<input type="text" defaultValue={"상세주소"}/>
        이미지<button type="file" >+</button>
        내용<textarea cols="50" rows="10"  style={{resize:"none"}} defaultValue={"내용"}/>
      <button>삭제</button>
      <button onClick={onClickEdit}>수정</button>
      </div>
    </div>
    </>
  );
};

export default Detail;