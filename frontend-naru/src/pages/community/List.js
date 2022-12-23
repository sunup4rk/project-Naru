import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import Bestpost from '../../components/common/bestpost/BestPost';
import Button01 from './../../components/common/button/Button01';
import Post from '../../components/common/post/Post';
import axios from 'axios';
import Swal from 'sweetalert2'
import './List.scss';

const List = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState([])
  
  useEffect(() => {
    const fetchPost = () => {
        axios.get("http://localhost:8080/community")
        .then((response) => {
            if(response.data.message === "조회 성공") {
              setPost(response.data.result)
              deletePost();
            }
        })
    }
    fetchPost();
}, []);

  const deletePost = () => {
    axios.delete("http://localhost:8080/community")
    .then((response) => {})
  }

  const onClickWrite = () => {
    axios.post("http://localhost:8080/islogin")
    .then((response) => {
        if(response.data.message === "로그인 성공") {
          navigate("/community/write")
        }
        else {
          Swal.fire({
            title: '게시글 작성',
            text: "로그인이 필요합니다.",
            icon: 'warning',
            showConfirmButton: false,
          }).then((result) => {
            navigate("/signin");
        })
      }
    })
  }

  const onClickMoveDetail = () => (e) => {
    navigate(`/community/detail/${e.target.id}`)
  }
  
  return (
    <>
    <Bestpost />
    <div className="list">
      <h1>전체글</h1>
      <div className="list__wrapper">
        <div className="list__posts">
          {post?.map((el) => (
            <Fragment key={el._id}>
              <Post page={"list"} id={el._id} onClick={onClickMoveDetail(el)} src={el.image_address[0]}
              title={el.post_title} writer={el.writer} time={el.post_time} like={el.like_count}/>
            </Fragment>
            ))}
        </div>
        <div className="list__button">
          <Button01 text={"작성"} onClick={onClickWrite} size={"s"}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default List;