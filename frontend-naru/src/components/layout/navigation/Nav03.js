import { Link } from "react-router-dom"
import { useRecoilState } from 'recoil';
import { loginState } from "../../../assets/State";
import axios from 'axios';
import "./Nav03.scss";
import { Modal } from "../../common/modal/Modal";

const Nav03 = (props) => {
// 이미지를 버튼으로 수정
    const [ , setLogin] = useRecoilState(loginState)
    const { Success, Failure } = Modal();

    const onClickLogout = async () => {
        try {
            const response = await axios.post("http://localhost:8080/signout")
            if(response.data.message === "로그아웃") {
                setLogin(false);
                Success("로그아웃 완료", "로그아웃 되었습니다.")
            }
        } catch(error) {
            Failure("로그아웃 오류", "로그아웃에 실패했습니다.")
        } 
    }

    return(
        <div className="Nav03">
            <ul className="Nav03__list">
                <li>
                    {props.level === 1 && <img src="images/membership/level1.svg" alt="membership"/>
 }
                </li>
                <li className="Nav03__user">
                    <span>{props.nickname}</span><span>님</span>
                </li>
                <li className="Nav03__menu">
                    <Link to="/mypage">
                        <img src="images/icon/mypage.svg" alt="mypage"/>
                    </Link>
                </li>
                <li className="Nav03__menu" onClick={onClickLogout} style={{cursor:"pointer"}}>
                    <img src="images/icon/logout.svg" alt="logout"/>
                </li>
            </ul>
        </div>
    )
}

export default Nav03;

