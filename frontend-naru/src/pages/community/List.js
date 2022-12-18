import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Modal } from './../../components/common/modal/Modal';
import axios from 'axios';
import './Write.scss';
import { useEffect, useState } from 'react';

const Detail = () => {
  const [cookie, ] = useCookies();
  const navigate = useNavigate();
  const { Warning, Failure } = Modal();
  const [post, setPost] = useState([])

  useEffect(() => {
    const fetchPost = () => {
        axios.get("http://localhost:8080/community")
        .then((response) => {
            if(response.data.message === "조회 성공") {
                setPost(response.data.result)
            }
        })
        .catch((error) => {
          Failure("게시글 조회 실패", "게시글 조회에 실패했습니다.")
        })
    }
    fetchPost();
}, []);

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
        {post.map((el) => (
          <div key={el._id}>
            <div>이미지</div>
            <div id={el._id} onClick={onClickMoveDetail(el)}>{el.post_title}</div>
            <div>{el.post_time}</div>
            <div>{el.like_count}</div>
          </div>
        ))}
      <button onClick={onClickWrite}>글 작성</button>
      </div>
    </div>
    </>
  );
};

export default Detail;