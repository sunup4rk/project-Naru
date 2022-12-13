import { useState } from "react";
import { ReactComponent as Logo } from "../../assets/images/logo01.svg";
import Button01 from "../../components/common/button/Button01";
import Input01 from "../../components/common/input/Input01";
import './SignUp.scss';
import axios from 'axios';

const SignUp = () => {
    const [Inputs, setInputs] = useState({
        email: "",
        nickname: "",
        password: "",
    });

    const onChangeInputs = (id) => (e) => {
        setInputs({
        ...Inputs,
        [id]: e.target.value
        });
    };
    

    const onClickSubmit = () => {
        console.log(Inputs)

    //     axios.post("/signUp", {
    //         email: Inputs.email,
    //         nickname: Inputs.nickname,
    //         password: Inputs.password
    //     })
    //     .then((response) => {
    //          // response
    //         console.log(response)
    //     }).catch((error) => {
    //         // 오류발생시 실행
    //         console.log(error)
    //     })
    }


    return (
        <div className="signUp">
            <form className="signUp-wrapper">
                <Logo height="55" role="img"/>
                    <Input01 type={"text"} placeholder={"이메일"} size={"m"} onChange={onChangeInputs("email")}/>
                    <Input01 type={"text"} placeholder={"인증번호"} size={"m"}/>
                    <Button01 type="button" text={"인증번호 확인"} size={"m"} />

                    <Input01 type={"text"} placeholder={"닉네임"} size={"m"} onChange={onChangeInputs("nickname")}/>
                    <Input01 type={"password"} placeholder={"비밀번호"} size={"m"} onChange={onChangeInputs("password")}/>
                    <Input01 type={"password"} placeholder={"비밀번호 확인"} size={"m"}/>
                    <Button01 type="button" text={"회원가입"} size={"m"} onClick={onClickSubmit}/>
            </form>
        </div>
    );
};

export default SignUp;