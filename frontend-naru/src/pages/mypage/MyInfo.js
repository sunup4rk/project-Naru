import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import axios from 'axios';
import './MyInfo.scss';

const MyInfo = () => {
  const [user, setUser] = useState();
  const { Warning } = Modal();
  const navigate = useNavigate();

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
    <div className="myinfo">
      <div className="myinfo__profile">
        <img src={user?.profile} alt="profile"/> 
        <span>{user?.nickname}</span>{" "}<span>님</span>
      </div>

      <div className="myinfo__info">
        <ul>
          <li>
            <span>등급</span>
            {user?.user_level}
          </li>
          <li>
            <span>포인트</span>
            {user?.user_point} P
          </li>
          <li>
            <span>게시글 수</span>{user?.posting_count}
          </li>
        </ul>
      </div>

      <span>좋아요 한 게시글</span>
      <div>
        <div>이미지</div>
        <div>제목</div>
        <div>날짜</div>
        <div>좋아요 수</div>
      </div>

      <span>내가 쓴 게시글</span>
      <div>
        <div>이미지</div>
        <div>제목</div>
        <div>날짜</div>
        <div>좋아요 수</div>
      </div>
    </div>
    
  );
};

export default MyInfo;