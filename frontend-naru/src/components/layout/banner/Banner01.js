import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Banner01.scss'

const Banner01 = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500
    };

    return(
        <div className='banner01'>
            <Slider {...settings}>
            <div className="banner01__item slideA">
                <div className="banner01__left">
                    <h1>“기분 전환이 필요한 나. 근데 뭐하지?”</h1>
                    <p>지금 내 주변에서 찾아보세요.</p>
                    <div>
                        <button className="banner01__button">바로가기</button>
                        <img className="banner01__arrow" src="images/icon/rightArrow.svg" alt="arrow"/>
                    </div>
                </div>
                <img src="images/carousel01.svg" alt="main_banner"/>
            </div>
            <div className="banner01__item slideB">
                <div className="banner01__left">
                    <h1>나만의 장소를 추천하고 포인트 받자!</h1>
                    <p>포인트를 모아 등급을 올려보세요.</p>
                    <div>
                        <button className="banner01__button">바로가기</button>
                        <img className="banner01__arrow" src="images/icon/rightArrow.svg" alt="arrow"/>
                    </div>
                </div>
                <img src="images/carousel02.svg" alt="main_banner"/>
            </div>
            <div className="banner01__item slideC">
                <div className="banner01__left">
                    <h1>포인트를 더 빨리 모으고 싶다면?</h1>
                    <p>미니게임에 도전해보세요!</p>
                    <div>
                        <button className="banner01__button">바로가기</button>
                        <img className="banner01__arrow" src="images/icon/rightArrow.svg" alt="arrow"/>
                    </div>
                </div>
                <img src="images/carousel03.svg" alt="main_banner"/>
            </div>
            </Slider>
        </div>
    )
}

export default Banner01;