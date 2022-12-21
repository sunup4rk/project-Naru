import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import axios from 'axios';

const MyInfo = () => {
  const [user, setUser] = useState();
  const { Warning } = Modal();
  const navigate = useNavigate()

  useEffect(() => {
      axios.post("http://localhost:8080/islogin")
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
    axios.get("http://localhost:8080/mypage")
    .then((response) => {
        if(response.data.message === "불러오기") {
          setUser(response.data)
        }
    })
  }

  return (
    <div>
      <img src={user?.profile} alt="profile"/> 
      <div>닉네임</div>{user?.nickname}
      <div>등급</div>{user?.user_level}
      <div>포인트</div>{user?.user_point}
      <div>게시글 수</div>{user?.posting_count}
      <hr/>
      <div>좋아요 한 게시글</div>
      <div>이미지</div>
      <div>제목</div>
      <div>날짜</div>
      <div>좋아요 수</div>
      <hr/>
      <div>내가 쓴 게시글</div>
      <div>이미지</div>
      <div>제목</div>
      <div>날짜</div>
      <div>좋아요 수</div>
    </div>
    
  );
};

export default MyInfo;