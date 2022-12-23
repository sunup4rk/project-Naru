import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal } from '../../components/common/modal/Modal';
import Post from '../../components/common/post/Post';


const MyPost = () => {
  const [ post, setPost ] = useState();
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
    axios.get("http://localhost:8080/mypage/post")
    .then((response) => {
        if(response.data.message === "게시글") {
          setPost(response.data)
        }
    })
  };

  const onClickMoveDetail = () => (e) => {
    navigate(`/community/detail/${e.target.id}`)
  }

  return (
    <div className="mylike">
      <div className="mylike-posts">
        {post?.result.map((el) => (
          <Fragment key={el._id}>
            <Post page={"like"} id={el._id} onClick={onClickMoveDetail(el)} src={el.image_address[0]}
            title={el.post_title} writer={el.writer} time={el.post_time} like={el.like_count}/>
          </Fragment>
          ))}
      </div>
    </div>
  );
};

export default MyPost;