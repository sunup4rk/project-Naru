import { Link } from 'react-router-dom';
import './Header.scss';

const Header = ({category, logout, login}) => {
    return (
        <div className='header'>
            <Link to="/">
                <img className='header__logo' src='images/logo.svg' alt='naru'/>
            </Link>
            {category}
            {/* {logout} */}
            {login}
        </div>
    )
}

export default Header;