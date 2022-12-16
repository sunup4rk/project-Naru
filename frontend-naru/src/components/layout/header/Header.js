import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../../assets/images/logo01.svg';
import { useEffect, useState } from 'react';
import Nav03 from '../navigation/Nav03';
import Nav02 from '../navigation/Nav02';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';

const Header = ({category}) => {
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState()
    const [cookie, ] = useCookies();
    
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.post("http://localhost:8080/islogin", {
            sessionID : cookie.sessionID
        })
        .then((response) => {
            if(response.data.message === "로그인 성공") {
                setLogin(true)
                console.log(response.data.message)
            }
            else {
            console.log(response.data.message)
            }
        })
      },[]);


    useEffect(() => {
         const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:8080/islogin", {
                sessionID : cookie.sessionID
            })
            setUser(response.data)
            console.log(user)

            } catch(error) {
                console.log(error);
            }}
               fetchData();
        }, []);


    return (
        <div className='header'>
            <Link to="/">
                <img className='header__logo' src={logo} alt='naru'/>
            </Link>
            {category}
            {login ? <Nav03 /> : <Nav02 />}
        </div>
    )
}

export default Header;