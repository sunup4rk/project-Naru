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

const RankingCulture = () => {
    const [ ranking, setRanking ] = useState();

    useEffect(() => {
        const fetchRanikng = () => {
            axios.get("http://localhost:8080/explore/culture")
            .then((response) => {
                if(response.data.message === "영화") {
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

    return (
        <div className="ranking">
            <h1>인기 영화</h1>
            <Slider {...settings}>
            {ranking?.map((el) => (
                <Fragment key={uuid()}>
                    <div className="ranking__card">
                        <img className="ranking__card__img" src={el.titleimg} />
                        <div className="ranking__card__title">{el.title}</div>      
                    </div>
                </Fragment>
            ))}
            </Slider>
        </div>
    );
};

export default RankingCulture;