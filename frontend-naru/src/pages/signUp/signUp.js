import { ReactComponent as Logo } from "../../assets/images/logo01.svg";
import Button01 from "../../components/common/button/Button01";
import Input01 from "../../components/common/input/Input01";
import './SignUp.scss';

const SignUp = () => {
    return (
        <div className="signUp">
            <div className="signUp-wrapper">
                <Logo height="55" role="img"/>
                <Input01 type={"text"} placeholder={"아이디"} size={"s"}/>
                <Input01 type={"text"} placeholder={"닉네임"} size={"s"}/>
                <Input01 type={"password"} placeholder={"비밀번호"} size={"s"}/>
                <Input01 type={"password"} placeholder={"비밀번호 확인"} size={"s"}/>
                <Button01 text={"회원가입"} size={"m"}/>
            </div>
        </div>
    );
};

export default SignUp;