import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { loginState } from './../../../store/State';
import Nav03 from '../navigation/Nav03';
import Nav02 from '../navigation/Nav02';
import axios from 'axios';
import './Header.scss';

const Header = ({category}) => {
    const [login, setLogin] = useRecoilState(loginState)
    const [user, setUser] = useState()
    
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const isLogin = () => {
            axios.post("http://localhost:8080/islogin")
            .then((response) => {
                if(response.data.message === "로그인 성공") {
                    setLogin(true)
                    setUser(response.data)
                }
            })
        }
        isLogin();
    }, [login]);

    return (
        <div className='header'>
            <Link to="/">
                <img className='header__logo' src="/images/icon/logo01.svg" alt='naru'/>
            </Link>
            {category}
            {login ?
            <Nav03 nickname={user?.nickname} level={user?.user_level}/> 
            : <Nav02 />}
        </div>
    )
}

export default Header;