import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as Logo } from "../../assets/images/logo01.svg";
import Button01 from "../../components/common/button/Button01";
import Input01 from "../../components/common/input/Input01";
import './SignUp.scss';
import axios from 'axios';
import { Modal } from '../../components/common/modal/Modal';
import { schema } from './Validation'
import  styled from 'styled-components';

const Error = styled.p`
    color: red;
    padding: 3px;
`

const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch} = useForm ({
        resolver: yupResolver(schema),
        mode : 'onChange',
        defaultValues : {
            emailCheck : false,
            authCheck : false,
            disabled : false
        }
    });
    const { Success, Warning, Failure } = Modal();
    
    const emailPattern = /\S+@\S+\.\S+/;

    const onClickEmail = () => {
        if(emailPattern.test(getValues("email"))) {
            axios.post("http://localhost:8080/signup/mail", {
                email: getValues("email")
            })
            .then((response) => {
                if(response.data.message === "인증메일이 발송되었습니다.") {
                    Success("인증메일 발송", response.data.message);
                    setValue("emailCheck", true);
                } else {
                    Warning("인증메일 발송 실패", response.data.message);
                    setValue("emailCheck", true);
                }
            })
            .catch((error) => {
                Failure("인증메일 발송 실패", "인증메일 발송에 실패했습니다.")
            })
        } 
        else {
            Warning("인증메일 발송 실패", "올바른 이메일 형식이 아닙니다.")
        }
    }

    const onClickAuth = () => {
        axios.post("http://localhost:8080/signup/auth", {
            email: getValues("email"),
            authNum: getValues("authNum")
        })
        .then((response) => {
            if(response.data.message === "인증되었습니다.") {
                Success("인증 확인", response.data.message);
                setValue("authCheck", true);
                setValue("disabled", true);
            } else {
                Warning("인증 실패", response.data.message);
                setValue("authCheck", false);
                setValue("disabled", false);
            }
        })
        .catch((error) => {
            Failure("인증 실패", "인증에 실패했습니다.")
        })
    }

    const onClickSignUp = (data) => {
        if(data.emailCheck === false || data.authCheck === false) {
            Warning("가입 실패", "이메일 인증이 필요합니다.")
        } else if (data.password !== data.passwordCheck) {
            Warning("가입 실패", "비밀번호가 일치하지 않습니다.")
        } else {
            axios.post("http://localhost:8080/signup", {
                email: data.email,
                nickname: data.nickname,
                password: data.password
            })
            .then((response) => {
                if(response.data.message === "가입되었습니다.🎉") {
                    Success("가입 완료", response.data.message);
                    navigate('/signin')
                }
                else {
                    Warning("가입 실패", response.data.message);
                }
            })
            .catch((error) => {
                Failure("가입 실패", "회원가입에 실패했습니다.")
            })
        }
    }


    return (
        <div className="signup">
            <form className="signup-wrapper" onSubmit={handleSubmit(onClickSignUp)}>
                <Logo height="55" role="img"/>
                    <div className="signup__auth">
                        <Input01 type={"text"} placeholder={"이메일"} size={"s"} register={register("email")} disabled={watch("disabled")}/>
                        <Button01 type={"button"} text={"인증메일 발송"} size={"m"} onClick={onClickEmail} />
                    </div>
                    <div className="signup__auth">
                        <Input01 type={"number"} placeholder={"인증번호"} size={"s"} register={register("authNum")}/>
                        <Button01 type={"button"} text={"인증번호 확인"} size={"m"} onClick={onClickAuth} />
                    </div>

                    <Input01 type={"text"} placeholder={"닉네임 (한글,영문,숫자 포함 2~8자)"} size={"m"} register={register("nickname")} />
                    <Error>{errors.nickname?.message}</Error>
                    <Input01 type={"password"} placeholder={"비밀번호 (숫자 12~64자)"} size={"m"} register={register("password")}/>
                    <Error>{errors.password?.message}</Error>
                    <Input01 type={"password"} placeholder={"비밀번호 확인 (숫자 12~64자)"} size={"m"} register={register("passwordCheck")} />
                    <Error>{errors.passwordCheck?.message}</Error>
                    <Button01 type={"submit"} text={"회원가입"} size={"m"}/>
            </form>
        </div>
    );
};

export default SignUp;