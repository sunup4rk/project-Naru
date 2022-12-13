import { ReactComponent as Logo } from "../../assets/images/logo01.svg";
import Button01 from "../../components/common/button/Button01";
import Input01 from "../../components/common/input/Input01";
import './SignIn.scss';

const SignIn = () => {
    return (
        <div className="signIn">
            <div className="signIn-container">
                <Logo height="55" role="img"/>
                <Input01 type={"text"} placeholder={"아이디"} size={"s"}/>
                <Input01 type={"password"} placeholder={"비밀번호"} size={"s"}/>
                <Button01 text={"로그인"} size={"m"}/>
            </div>
        </div>
    );
};

export default SignIn;