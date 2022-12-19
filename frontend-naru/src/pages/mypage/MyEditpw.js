import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../components/common/modal/Modal';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';


const MyEditpw = () => {
  const [check, setCheck] = useState(false);
  const [cookie, ] = useCookies();
  const { Success, Warning, Failure } = Modal();
  const { register, handleSubmit, getValues } = useForm();
  
  useEffect(() => {
    axios.post("http://localhost:8080/islogin", {
      sessionID : cookie.sessionID
    })
    .then((response) => {
      if(response.data.message === "로그인 성공") {
      }
      else {
        Warning("마이페이지", "로그인이 필요합니다.")
        // 버튼 클릭 시 로그인 페이지로 이동
      }
    })
    .catch((error) => {
      Failure("마이페이지", "회원 정보를 불러올 수 없습니다.")
      // 로그인으로 ?
    })
  }, [])

  const onClickCheck = () => {
    axios.post("http://localhost:8080/mypage/editpw/check", {
      password: getValues("passwordCheck")
    })
    .then((response) => {
        if(response.data.message === "비밀번호 일치") {
          setCheck(true)
        } else {
            Warning("확인 실패", response.data.message);
        }
    }).catch((error) => {
        Failure("확인 실패", "비밀번호 확인에 실패했습니다.")
    })
  }

  const onClickEdit = () => {
    axios.put("http://localhost:8080/mypage/editpw/change", {
      password: getValues("passwordEdit")
    })
    .then((response) => {
        if(response.data.message === "비밀번호가 변경되었습니다.") {
          Success("변경 완료", response.data.message)
        }
    }).catch((error) => {
        Failure("변경 실패", "비밀번호 변경에 실패했습니다.")
    })
  }

  return (
    <div>
      { check ? 
      <form style={{display: "flex", flexDirection:"column"}} onSubmit={handleSubmit(onClickEdit)}>
        비밀번호 변경<input type={"password"} {...register("passwordEdit")}/>
        <input type={"text"} />
        <button>변경</button>
      </form>

      :
        <form style={{display: "flex", flexDirection:"column"}} onSubmit={handleSubmit(onClickCheck)}>
        비밀번호 재확인<input type={"password"} {...register("passwordCheck")}/>
        <button>확인</button>
        </form>
      }
    </div>
  );
};

export default MyEditpw;