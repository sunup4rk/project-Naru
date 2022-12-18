import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { loginState } from '../../../assets/State';
import logo from '../../../assets/images/logo01.svg';
import Nav03 from '../navigation/Nav03';
import Nav02 from '../navigation/Nav02';
import axios from 'axios';
import './Header.scss';

const Header = ({category}) => {
    const [login, setLogin] = useRecoilState(loginState)
    const [user, setUser] = useState()
    const [cookie, ] = useCookies();
    
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const isLogin = () => {
            axios.post("http://localhost:8080/islogin", {
                sessionID : cookie.sessionID
            })
            .then((response) => {
                if(response.data.message === "로그인 성공") {
                    setLogin(true)
                    setUser(response.data)
                }
            })
        }
        isLogin();
    }, []);

    return (
        <div className='header'>
            <Link to="/">
                <img className='header__logo' src={logo} alt='naru'/>
            </Link>
            {category}
            {login ?
            <Nav03 nickname={user?.nickname} level={user?.user_level}/> 
            : <Nav02 />}
        </div>
    )
}

export default Header;