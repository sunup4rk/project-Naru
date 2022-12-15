import { Link } from "react-router-dom"
import "./Nav03.scss";

const Nav03 = () => {

    return(
        <div className="Nav03">
            <ul className="Nav03__list">
                <li>
                    <img src="images/membership/level1.svg" alt="membership"/>
                </li>
                <li className="Nav03__user">
                    <span>김혜진</span><span>님</span>
                </li>
                <li className="Nav03__menu">
                    <Link to="/mypage">
                        <img src="images/icon/mypage.svg" alt="mypage"/>
                    </Link>
                </li>
                <li className="Nav03__menu">
                    <img src="images/icon/logout.svg" alt="logout"/>
                </li>
            </ul>
        </div>
    )
}

export default Nav03;

