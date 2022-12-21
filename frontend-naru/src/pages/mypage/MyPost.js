import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal } from '../../components/common/modal/Modal';
import { useCookies } from 'react-cookie';


const MyPost = () => {
  const [user, setUser] = useState();
  const [cookie, ] = useCookies();
  const { Warning } = Modal();
  const navigate = useNavigate()

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
        navigate("/signin")

      }
    })
  }, [])

  const userData = () => {
    axios.get("http://localhost:8080/mypage/post")
    .then((response) => {
        if(response.data.message === "게시글") {
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

export default MyPost;