import { Link, useLocation } from 'react-router-dom';
import './Aside01.scss';

const Aside01 = () => {
  const location = useLocation();
  const path = location.pathname;

  const category = [
    {name: "카페", page: "/explore/cafe"},
    {name: "오락", page: "/explore/entertainment"},
    {name: "문화", page: "/explore/culture"},
  ]

  return (
      <div className="aside01">
            <ul className="aside01__list">
            {category.map((menu) => (
                <li key={menu.page} className="aside01__menu" >
                    <Link to={menu.page} className={path === menu.page ? "aside01__item--active" : "aside01__item"}>
                      {menu.name}
                    </Link>
                </li>
            ))}
            </ul>
        </div>
  );
};

export default Aside01;