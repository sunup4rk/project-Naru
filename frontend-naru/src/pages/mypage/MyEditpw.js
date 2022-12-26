import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Modal } from '../../components/common/modal/Modal';
import { useForm } from 'react-hook-form';
import { schema } from './PasswordValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import Input01 from './../../components/common/input/Input01';
import Button01 from './../../components/common/button/Button01';
import axios from 'axios';
import './MyEditpw.scss';

const MyEditpw = () => {
  const [check, setCheck] = useState(false);
  const { Success, Warning, Failure } = Modal();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    mode : 'onChange',
  });  const navigate = useNavigate()

  useEffect(() => {
      axios.post("http://localhost:8080/islogin")
      .then((response) => {
        if (response.data.message === "로그인 성공") {}
        else {
          Warning("마이페이지", "로그인이 필요합니다.")
          navigate("/signin")
        }
      })

  }, [])

  const onClickCheck = (data) => {
    axios.post("http://localhost:8080/mypage/editpw/check", {
      password: data.password
    })
    .then((response) => {
        if(response.data.message === "비밀번호 일치") {
          setCheck(true)
          setValue("password", "")
        } else {
          Warning("확인 실패", response.data.message);
        }
    }).catch((error) => {
        Failure("확인 실패", "비밀번호 확인에 실패했습니다.")
    })
  }

  const onClickEdit = (data) => {
    if(data.passwordChange === data.passwordCheck) {
      axios.put("http://localhost:8080/mypage/editpw/change", {
        password: data.passwordChange
      })
      .then((response) => {
          if(response.data.message === "비밀번호가 변경되었습니다.") {
            Success("변경 완료", response.data.message)
          }
      }).catch((error) => {
          Failure("변경 실패", "비밀번호 변경에 실패했습니다.")
      })
    }
    else {
      Warning("변경 실패", "비밀번호가 일치하지 않습니다.")
    }
  }

  return (
    <div className="myeditpw">
      { check ? 
      <form className="myeditpw-wrapper" onSubmit={handleSubmit(onClickEdit)}>
        <span>비밀번호 변경</span>
        <Input01 type={"password"} register={register("passwordChange")} placeholder={"비밀번호"}/>
        <p>{errors.passwordChange?.message}</p>
        <Input01 type={"password"} register={register("passwordCheck")} placeholder={"비밀번호 확인"}/>
        <p>{errors.passwordCheck?.message}</p>
        <Button01 text={"변경"} size={"s"} />
      </form>
      :
      <form className="myeditpw-wrapper" onSubmit={handleSubmit(onClickCheck)}>
        <span>비밀번호 재확인</span>
        <Input01 type={"password"} register={register("password")} placeholder={"비밀번호"} />
        <Button01 text={"확인"} size={"s"} />
      </form>
      }
    </div>
  );
};

export default MyEditpw;