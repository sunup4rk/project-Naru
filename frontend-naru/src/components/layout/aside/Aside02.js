import { Link, useLocation } from 'react-router-dom';
import './Aside02.scss';

const Aside02 = () => {
  const location = useLocation();
  const path = location.pathname;

  const category = [
    {name: "내 정보", page: "/mypage"},
    {name: "회원정보 수정", page: "/mypage/edit"},
    {name: "비밀번호 변경", page: "/mypage/editpw"},
    {name: "좋아요 한 게시글", page: "/mypage/like"},
    {name: "내가 쓴 게시글", page: "/mypage/post"},
    {name: "문의내역", page: "/mypage/qna"},
  ]

  return (
    <div className="aside02">
      <ul className="aside02__list">
      {category.map((menu) => (
        <li key={menu.page} className="aside02__menu" >
          <Link to={menu.page} className={path === menu.page ? "aside02__item--active" : "aside02__item"}>
            {menu.name}
          </Link>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default Aside02;