import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../../assets/images/logo01.svg';
import { useEffect, useState } from 'react';
import Nav03 from '../navigation/Nav03';
import Nav02 from '../navigation/Nav02';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRecoilState } from 'recoil';
import { loginState } from '../../../assets/State';
import { Modal } from '../../common/modal/Modal';

const Header = ({category}) => {
    const [login, setLogin] = useRecoilState(loginState)
    const [user, setUser] = useState()
    const [cookie, ] = useCookies();
    const { Success, Failure } = Modal();
    
    axios.defaults.withCredentials = true;

    useEffect(() => {
         const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:8080/islogin", {
                sessionID : cookie.sessionID
            })
            if(response.data.message === "로그인 성공") {
                setLogin(true)
                setUser(response.data)
                Success("로그인 완료", "로그인 되었습니다.")
            }
            } catch(error) {
                Failure("로그인 오류", "로그인 정보를 불러올 수 없습니다.")
            }}
               fetchData();
        }, []);


        useEffect(() => {
        }, [user])


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