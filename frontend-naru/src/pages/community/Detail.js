import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import MapDetail from '../../components/common/map/MapDetail';
import Button01 from '../../components/common/button/Button01';
import Button02 from '../../components/common/button/Button02';
import Swal from 'sweetalert2'
import axios from 'axios';
import uuid from 'react-uuid';
import './Detail.scss';

const Detail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [ post, setPost ] = useState();
  const [ like, setLike ] = useState(false);
  const [ myPost, setMyPost ] = useState("불일치");
  const { Success, Warning, Failure } = Modal();

  useEffect(() => {
    const fetchPost = () => {
      axios.get(`http://localhost:8080/community/detail/${params.id}`)
      .then((response) => {
        if(response.data.message === "일치") {
          setPost(response.data.result);
          setMyPost(response.data.message)
        }
        else {
          setPost(response.data.result);
        }
      })
    };
    fetchPost();
  }, [like])

  const onClickLike = () => {
    axios.post(`http://localhost:8080/community/detail/like/${params.id}`)
    .then((response) => {
        if(response.data.message === "좋아요") {
          setLike( prev => !prev )
          }
        else {
          Warning("오류", "회원만 가능합니다.")
        }
    })
    .catch((error) => {
      console.log('오류')
      Failure("오류", "처리에 실패했습니다.")
    })
  }

  const onClickEdit = () => {
    navigate(`/community/edit/${params.id}`)
  }

  const onClickList = () => {
    navigate("/community")
  }

  const onClickDelete = () => {
    Swal.fire({
      title: '게시글 삭제',
      text: "게시글을 삭제하시겠습니까?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4461AA',
      cancelButtonColor: '##D1D9DE',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/community/delete/${params.id}`)
        .then((response) => {
            if(response.data.message === "삭제 완료") {
              Success("삭제 완료", "게시글이 삭제되었습니다.");
              navigate("/community");
            }
        })
        .catch((error) => {
          Failure("게시글 삭제 실패", "게시글 삭제에 실패했습니다.")
        })
      }
    })
  }

  return (
    <>
      <div className="detail">
        <div className="detail__wrapper">
          <div className="detail__post">
              <h1>{post?.post_title}</h1>
              <div className="detail__post__date">{post?.post_time}</div>
              <div className="detail__post__user">
                {post?.profile ? 
                  <img src={post?.profile} alt="profile image"/>
                :
                  <img src="/images/icon/user.svg" alt="profile image"/>
                }
                <div>{post?.writer}</div>
              </div>
              
              <MapDetail address={post?.post_address} detail={post?.post_address_detail}/>

            <div className="detail__post__image">
            {post?.image_address.map((el) => (
              <div key={uuid()}>
                <img src={el} alt="post image"/>
              </div>
            ))}
            </div>
            <pre>{post?.post_content}</pre>
            <button className="detail__post__like" onClick={onClickLike}>
              <img src="/images/icon/full_heart.svg" alt="like"/>
            </button>
            <div>{post?.like_count}</div>
          </div>
          {myPost === "일치" ?
            <div className="detail__button">
              <Button01 text={"수정"} onClick={onClickEdit} size={"s"}/>
              <Button02 text={"목록"} size={"s"} onClick={onClickList}/>
              <Button01 text={"삭제"} onClick={onClickDelete} size={"s"}/>
            </div>
            :
            <div className="detail__button">
            <Button02 text={"목록"} onClick={onClickList} size={"s"} />
          </div>
          }
        </div>
      </div>
    </>
  )
}

export default Detail;