import './Footer.scss'

const Footer = () => {

    return(
        <div className="footer">
                <img src="/images/icon/logo02.svg" alt="naru" className="footer__logo"/>
                <div className='footer-contents'>
                    <ul>
                        <li className="footer-contents__title">
                            Frontend
                        </li>
                        <li className="footer-contents__member">
                            <span>김혜진</span>
                            <img src="/images/icon/phone.svg" alt="phone"/>
                            <img src="/images/icon/gmail.svg" alt="gmail"/>
                        </li>
                    </ul>

                    <ul className="footer-contents__list">
                        <li className="footer-contents__title">
                            Backend
                        </li>
                        <li className="footer-contents__member">
                            <span>박선우</span>
                            <img src="/images/icon/phone.svg" alt="phone"/>
                            <img src="/images/icon/gmail.svg" alt="gmail"/>
                        </li>
                        <li className="footer-contents__member">
                            <span>정두식</span>
                            <img src="/images/icon/phone.svg" alt="phone"/>
                            <img src="/images/icon/gmail.svg" alt="gmail"/>
                        </li>
                    </ul>

                    <ul>
                        <li className="footer-contents__title">
                            Github
                        </li>
                        <li className="footer-contents__icon">
                            <a href="https://github.com/sunup4rk/project-Naru" target="_blank" rel="noopener noreferrer">
                                <img src="/images/icon/github.svg" alt="gmail"/>
                            </a>
                        </li>
                    </ul>

                    <ul>
                        <li className="footer-contents__title">
                            Notion
                        </li>
                        <li className="footer-contents__icon">
                            <a href="https://canyon-buffer-0c2.notion.site/Naru-41ebf4098e14423ba0681501c84cadff" target="_blank" rel="noopener noreferrer">
                                <img src="/images/icon/notion.svg" alt="gmail"/>
                            </a>
                        </li>
                    </ul>
                </div>
        </div>
    )
}

export default Footer;