import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Modal } from '../../components/common/modal/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './NicknameValidation';
import UploadProfile from '../../components/common/upload/UploadProfile';
import Input01 from './../../components/common/input/Input01';
import Button01 from './../../components/common/button/Button01';
import axios from 'axios';
import './MyEdit.scss';

const MyEdit = () => {
  const [ user, setUser ] = useState();
  const [ image, setImage ] = useState([""]);
  const { Success, Warning, Failure } = Modal();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode : 'onChange',
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLogin = () => {
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

  const onClickEdit = (data) => {
    axios.post("http://localhost:8080/mypage/edit", {
      nickname: data.nickname
    })
    .then((response) => {
        if(response.data.message === "수정 성공") {
          Success("수정 완료", "회원정보가 수정되었습니다.")
          window.location.reload();
        } else {
            Warning("수정 실패", response.data.message);
        }
    }).catch((error) => {
        Failure("수정 실패", "회원정보 수정에 실패했습니다.")
    })
  }

  return (
    <div className="myedit">
      <form className="myedit-wrapper" onSubmit={handleSubmit(onClickEdit)}>
      <UploadProfile onChangeImage={onChangeImage} image={image} profile={user?.profile}/>
      <div className="myedit__input">
        <div>
          <span>이메일</span>
          <Input01 defaultValue={user?.email} disabled={true} />
        </div>
        <div>
          <span>닉네임</span>
          <Input01 type={"text"} defaultValue={user?.nickname} register={register("nickname")} />
          <p>{errors.nickname?.message}</p>
        </div>
      </div>
        <Button01 text={"수정"} size={"s"}/>
      </form>
    </div>
  );
};

export default MyEdit;