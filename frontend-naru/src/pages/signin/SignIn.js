import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ReactComponent as Logo } from "../../assets/images/logo01.svg";
import { Modal } from './../../components/common/modal/Modal';
import Button01 from "../../components/common/button/Button01";
import Input01 from "../../components/common/input/Input01";
import './SignIn.scss';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const SignIn = () => {
    const navigate = useNavigate();
    const { register, handleSubmit} = useForm();
    const { Warning, Failure } = Modal();
    const [ , setCookie ] = useCookies();
    
    axios.defaults.withCredentials = true;

    const onClickSignIn = (data) =>{

        axios.post("http://localhost:8080/signin", {
            email: data.email,
            password: data.password
        })
        .then((response) => {
            if(response.data.message === "로그인 성공") {
                setCookie('sessionID', response.data.sessionID)
                console.log(response.data)
                navigate('/')
            }
            else {
                Warning("로그인 실패", response.data.message);
            }
        }).catch((error) => {
            Failure("로그인 실패", "로그인에 실패했습니다.")
        })
    }

    return (
        <div className="signIn">
            <form className="signIn-wrapper --top" onSubmit={handleSubmit(onClickSignIn)}>
                <Logo height="55" role="img"/>
                <Input01 type={"text"} placeholder={"이메일"} size={"m"} register={register("email")} />
                <Input01 type={"password"} placeholder={"비밀번호"} size={"m"} register={register("password")}/>
                <Button01 text={"로그인"} size={"m"}/>
            </form>

            <div className="signIn-wrapper --bottom">
                <span>회원이 아니신가요?</span>
                <Link to={"/signUp"}>
                    <Button01 text={"회원가입"} size={"m"}/>
                </Link>
            </div>
        </div>
    );
};

export default SignIn;