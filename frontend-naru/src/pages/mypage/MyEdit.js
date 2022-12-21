import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal } from '../../components/common/modal/Modal';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import UploadProfile from '../../components/common/upload/UploadProfile';
import { uuid } from 'react-uuid';

const MyEdit = () => {
  const [ user, setUser ] = useState();
  const [ cookie, ] = useCookies();
  const [ image, setImage ] = useState([""]);
  const { Success, Warning, Failure } = Modal();
  const { register, handleSubmit, getValues } = useForm();
  const navigate = useNavigate();
  
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
          navigate("/signin")
        }
      })
    }
    isLogin();
  }, [image])

  const userData = () => {
    axios.get("http://localhost:8080/mypage/edit")
    .then((response) => {
        if(response.data.message === "불러오기") {
          setUser(response.data)
        }
    })
    .catch((error) => {
      Failure("조회 실패", "회원정보 조회에 실패했습니다.")
    })
  }

  const onChangeImage = (img) => {
    setImage(img);
  }

  const onClickEdit = () => {
    axios.post("http://localhost:8080/mypage/edit", {
      nickname: getValues("nickname")
    })
    .then((response) => {
        if(response.data.message === "수정 성공") {
          Success("회원정보 수정 완료", "회원정보가 수정되었습니다.")
          window.location.reload();
        } else {
            Warning("회원정보 수정 실패", response.data.message);
        }
    }).catch((error) => {
        Failure("회원정보 수정 실패", "회원정보 수정에 실패했습니다.")
    })
  }

  return (
    <div>
      <form style={{display: "flex", flexDirection:"column"}} onSubmit={handleSubmit(onClickEdit)}>
        <UploadProfile onChangeImage={onChangeImage} image={image} profile={user?.profile}/>
        이메일 <input type="text" defaultValue={user?.email} disabled/>
        닉네임<input type={"text"} defaultValue={user?.nickname} {...register("nickname")}/>
        <button>수정</button>
      </form>
    </div>
  );
};

export default MyEdit;