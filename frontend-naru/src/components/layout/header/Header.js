import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../../assets/images/logo01.svg';

const Header = ({category, logout, login}) => {
    return (
        <div className='header'>
            <Link to="/">
                <img className='header__logo' src={logo} alt='naru'/>
            </Link>
            {category}
            {/* {logout} */}
            {login}
        </div>
    )
}

export default Header;