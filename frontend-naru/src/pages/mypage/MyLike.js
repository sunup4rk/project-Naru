import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../components/common/modal/Modal';
import { useCookies } from 'react-cookie';


const MyLike = () => {
  const [user, setUser] = useState();
  const [cookie, ] = useCookies();
  const { Warning } = Modal();

  useEffect(() => {
    axios.post("http://localhost:8080/islogin", {
      sessionID : cookie.sessionID
    })
    .then((response) => {
      if(response.data.message === "로그인 성공") {
        userData();
      }
      else {
        Warning("마이페이지", "로그인이 필요합니다.")
        // 버튼 클릭 시 로그인 페이지로 이동
      }
    })
  }, [])

  const userData = () => {
    axios.get("http://localhost:8080/userinfo")
    .then((response) => {
        if(response.data.message === "ex)불러오기") {
          setUser(response.data)
        }
    })
  };


  return (
    <div>
      <div>이미지</div>
      <div>제목</div>
      <div>날짜</div>
      <div>좋아요 수</div>
    </div>
  );
};

export default MyLike;