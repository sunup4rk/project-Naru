import './Header.scss';
import Nav from './../navigation/Nav';

const Header = () => {

    return(
        <div className='header'>
            <img className='header__logo' src='images/logo.svg' alt='naru_logo'/>
            <Nav />
        </div>
    )
}

export default Header;