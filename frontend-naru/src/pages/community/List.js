import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Modal } from './../../components/common/modal/Modal';
import axios from 'axios';
import './Write.scss';

const Detail = () => {
  console.log('디테일');
  
  const [cookie, ] = useCookies();
  const navigate = useNavigate();
  const { Warning } = Modal();

  const onClickWrite = () => {
    axios.post("http://localhost:8080/islogin", {
        sessionID : cookie.sessionID
    })
    .then((response) => {
        if(response.data.message === "로그인 성공") {
          navigate("/community/write")
        }
        else {
          Warning("게시글 작성", "로그인이 필요합니다.")
        }
    })
  }

  const onClickMoveDetail = (el) => (e) => {
    navigate(`/community/detail/${e.target.id}`)
  }


  return (
    <>
    <div className="write">
      <div className="write-wrapper">
        <div>이미지</div>
        <div id={"아이디"} onClick={onClickMoveDetail("el")}>타이틀</div>
        <div>날짜</div>
        <div>좋아요 수</div>
      <button onClick={onClickWrite}>글 작성</button>
      </div>
    </div>
    </>
  );
};

export default Detail;