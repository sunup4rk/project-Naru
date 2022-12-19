import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../components/common/modal/Modal';
import { useCookies } from 'react-cookie';


const MyInfo = () => {
  const [user, setUser] = useState();
  const [cookie, ] = useCookies();
  const { Warning, Failure } = Modal();

  useEffect(() => {
    const isLogin = () => {
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
    }
    isLogin();
  }, [])

  const userData = () => {
    axios.get("http://localhost:8080/mypage")
    .then((response) => {
        if(response.data.message === "불러오기") {
          setUser(response.data)
        }
    })
    .catch((error) => {
      Failure("조회 실패", "회원정보 조회에 실패했습니다.")
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