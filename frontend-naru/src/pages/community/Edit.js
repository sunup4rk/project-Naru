import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import Write from './Write';
import axios from 'axios';
import './Write.scss';

const Edit = () => {
  const params = useParams();
  const [editPost, setEditPost] = useState();
  const { Failure } = Modal();

  useEffect(() => {
    const fetchPost = () => {
      axios.get(`http://localhost:8080/community/edit/${params.id}`)
      .then((response) => {
          if(response.data.message === "전송") {
            setEditPost(response.data.result);
          }
      })
      .catch((error) => {
        Failure("게시글 조회 실패", "게시글 조회에 실패했습니다.")
      })
    };
    fetchPost();
  }, [])

  return (
    <Write isEdit={true} editPost={editPost}/>
  );
};

export default Edit;