import { Link } from "react-router-dom"
import "./Nav01.scss";

const Nav01 = () => {
    const category = [
        { name: "찾아보기", page: "/explore/cafe"},
        { name: "커뮤니티", page: "/community"},
        { name: "포인트", page: "/point"},
        { name: "문의", page: "/qna"},
    ]

    return(
        <div className="Nav01">
            <ul className="Nav01__list">
            {category.map((menu) => (
                <li key={menu.page} className="Nav01__menu">
                    <Link to={menu.page}>{menu.name}</Link>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default Nav01;

