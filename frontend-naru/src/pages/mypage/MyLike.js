import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import axios from 'axios';

const MyLike = () => {
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
    axios.get("http://localhost:8080/mypage/like")
    .then((response) => {
        if(response.data.message === "좋아요") {
          setUser(response.data)
        }
    })
  };

  return (
    <div>
      {/* {user?.map((el) => (
        <div></div>
      ))} */}
    </div>
  );
};

export default MyLike;