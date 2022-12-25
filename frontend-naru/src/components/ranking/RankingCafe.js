import { useEffect, useState, Fragment } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';
import axios from 'axios';
import uuid from 'react-uuid';
import './Ranking.scss';

const  PrevArrow = styled.div`
`
const  NextArrow = styled.div`
`

const RankingCafe = () => {
    const [ ranking, setRanking ] = useState();

    useEffect(() => {
        const fetchRanikng = () => {
            axios.get("http://localhost:8080/explore/cafe")
            .then((response) => {
                if(response.data.message === "카페") {
                    setRanking(response.data.result)
                }
            })
        }
    fetchRanikng();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        nextArrow: 
        <NextArrow>
            <img src="/images/icon/rightArrow.svg" />
        </NextArrow>,
        prevArrow:
        <PrevArrow>
            <img src="/images/icon/leftArrow.svg" />
        </PrevArrow>
    };

    const house = "https://blog.kakaocdn.net/dn/cneQPf/btrRT36nPiV/8vhu4hFcT5KccbKerM8gYk/img.jpg"
    const morning = "https://mblogthumb-phinf.pstatic.net/20160902_83/bora_2010_14727464835629tXr2_JPEG/%BC%BC%BB%F3%C0%C7_%B8%F0%B5%E7%BE%C6%C4%A7.JPG?type=w2"
    const dotori = "https://ak-d.tripcdn.com/images/1i65a2224t6vujy281B51_R_400_10000_R5_Q90.jpg_.webp?proc=source/trip"
    const ikseon = "https://blog.kakaocdn.net/dn/bHFKYU/btqJVN4ZWO2/iUxOPHvUUZyOIaQ2luRBLK/img.jpg"
    const theSpot = "https://asset.blimp.space/space/eJrwxf/images/f8de59f1-7964-444c-b984-1934a6d49067.jpg"
    const beebeede = "https://ssproxy.ucloudbiz.olleh.com/v1/AUTH_e59809eb-bdc9-44d7-9d8f-2e7f0e47ba91/uploads/ds_38796_6361efee485ed.jpg"
    const samda = "https://ak-d.tripcdn.com/images/1i65k223494mvqgqoA105.jpg?proc=source/trip"
    const kitchen ="https://blog.kakaocdn.net/dn/Miwtg/btqOFiZi7bA/cROpL8iltOG2kROhBeHhv1/img.jpg"
    const offer = "https://mblogthumb-phinf.pstatic.net/MjAyMDA0MjZfMTI4/MDAxNTg3OTAwODQxMDE3.6iAROXvITlXne5rNkQmaw3FRfjT462Zuix0_KKhOP7Mg.xEJYXnZFHKlOJRUWXqgZRAuhs33ixxCIvwKxCaxLYlcg.JPEG.kjh980412/output_2479643118.jpg?type=w800"
    const push = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStnuyJjWvq4N66QrQseC8xCu1CzHcH69N9Mw&usqp=CAU"


    return (
        <div className="ranking">
            <h1>인기 카페</h1>
            <Slider {...settings}>
            {ranking?.map((el) => (
                <Fragment key={uuid()}>
                    <div className="ranking__card">
                        {el === "테디뵈르하우스" && <img src={house} className="ranking__card__img" alt="cafe" />}
                        {el === "세상의모든아침 여의도점" && <img src={morning} className="ranking__card__img" alt="cafe" />}
                        {el === "도토리가든" && <img src={dotori} className="ranking__card__img" alt="cafe" />}
                        {el === "익선잡방" && <img src={ikseon} className="ranking__card__img" alt="cafe" />}
                        {el === "더 스팟 패뷸러스" && <img src={theSpot} className="ranking__card__img" alt="cafe" />}
                        {el === "비비드크로넛 본점" && <img src={beebeede} className="ranking__card__img" alt="cafe" />}
                        {el === "삼다코지" && <img src={samda} className="ranking__card__img" alt="cafe" />}
                        {el === "키친205 롯데월드점" && <img src={kitchen} className="ranking__card__img" alt="cafe" />}
                        {el === "오퍼 카페" && <img src={offer} className="ranking__card__img" alt="cafe" />}
                        {el === "푸쉬커피 을지" && <img src={push} className="ranking__card__img" alt="cafe" />}
                        {/* <img src={""} className="ranking__card__img" alt="cafe" /> */}
                        <p className="ranking__card__title">{el}</p>      
                    </div>
                </Fragment>
            ))}
            </Slider>
        </div>
    );
};

export default RankingCafe;