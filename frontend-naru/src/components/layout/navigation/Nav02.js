import { Link } from "react-router-dom"
import "./Nav02.scss";

const Nav02 = () => {

    return(
        <div className="Nav02">
            <ul className="Nav02__list">
                <li className="Nav02__menu">
                    <Link to="/signIn" >로그인</Link>
                </li>
                <li className="Nav02__menu">
                    <Link to="/signUp" >회원가입</Link>
                </li>
            </ul>
        </div>
    )
}

export default Nav02;

