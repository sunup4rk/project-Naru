import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import Swal from 'sweetalert2'
import axios from 'axios';
import './Write.scss';

const Detail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState();
  const [myPost, setMyPost] = useState("불일치");
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
      .catch((error) => {
        Failure("게시글 조회 실패", "게시글 조회에 실패했습니다.")
      })
    };
    fetchPost();
  }, [])

  const onClickLike = () => {
    axios.post(`http://localhost:8080/community/detail/like/${params.id}`)
    .then((response) => {
        if(response.data.message === "좋아요") {
          console.log('처리성공')
          
          // ========================= 여기 =========================== //

          // setPost( ...post, {like_count : response.data.like_count})

          // ========================= 여기 ========================== //
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
      <div className="write">
        <div className="write-wrapper">
          <div style={{display:"flex", flexDirection:"column"}}>
            <div>제목{post?.post_title}</div>
            <div>주소{post?.post_address}</div>
            <div>상세주소{post?.post_address_detail}</div>
            이미지<button type="file" >+</button>
            내용<pre>{post?.post_content}</pre>
          </div>
          {myPost === "일치" &&
            <>
              <button onClick={onClickEdit}>수정</button>
              <button onClick={onClickDelete}>삭제</button>
            </>
          }
          <button onClick={onClickLike}>좋아요</button>
          <div>{post?.like_count}</div>
        </div>
      </div>
    </>
  )
}

export default Detail;