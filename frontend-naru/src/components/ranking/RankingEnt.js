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

const RankingEnt = () => {
    const [ranking, setRanking] = useState();

    useEffect(() => {
        const fetchRanikng = () => {
            axios.get("http://localhost:8080/explore/ent")
            .then((response) => {
                if(response.data.message === "오락") {
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

    const lol = "https://theme.zdassets.com/theme_assets/43400/87a1ef48e43b8cf114017e3ad51b801951b20fcf.jpg"
    const fifa = "https://www.giantbomb.com/a/uploads/scale_small/37/376319/3006078-6.jpg"
    const dunjeon = "https://imgnn.seoul.co.kr/img/upload/2010/07/29/SSI_20100729174347.jpg"
    const overwatch = "https://images.igdb.com/igdb/image/upload/t_720p/co5tkm.jpg"
    const sudden = "https://cdn.gametoc.co.kr/news/photo/201207/2832_5274_739.jpg"
    const maple = "https://g.nexonstatic.com/maplestory/micro-site/static/landing/share_tw.jpeg"
    const lostark = "https://level-1.fr/Principal/wp-content/uploads/2022/02/300px-Lost_Ark_cover.jpg"
    const valorant = "https://m.media-amazon.com/images/M/MV5BNmNhM2NjMTgtNmIyZC00ZmVjLTk4YWItZmZjNGY2NThiNDhkXkEyXkFqcGdeQXVyODU4MDU1NjU@._V1_FMjpg_UX1000_.jpg"
    const battle = "https://t1.daumcdn.net/cfile/tistory/993A6B3359D753C503"
    const starcraft = "https://w.namu.la/s/6ee9c47ffc80418fa8b4a92a0abd511d91c93f2d6274fd36734bf61a83a0a0eaee40bd61f44e2566b109d201980fa93f12640f4152fa95d7fbbe0e7942147648d8423abcd70d172e14213de16f39edff4375a9db999070e124a98cefcea550a6"

    return (
        <div className="ranking">
            <h1>인기 게임</h1>
            <Slider className="ranking__slider" {...settings}>
            {ranking?.map((el) => (
                <Fragment key={uuid()}>
                    <div className="ranking__card">
                        {el === "리그 오브 레전드" && <img src={lol} className="ranking__card__img" alt="game" />}
                        {el === "FIFA 온라인 4" && <img src={fifa} className="ranking__card__img" alt="game" />}
                        {el === "던전앤파이터" && <img src={dunjeon} className="ranking__card__img" alt="game" />}
                        {el === "오버워치 2" && <img src={overwatch} className="ranking__card__img" alt="game" />}
                        {el === "서든어택" && <img src={sudden} className="ranking__card__img" alt="game" />}
                        {el === "메이플스토리" && <img src={maple} className="ranking__card__img" alt="game" />}
                        {el === "로스트아크" && <img src={lostark} className="ranking__card__img" alt="game" />}
                        {el === "발로란트" && <img src={valorant} className="ranking__card__img" alt="game" />}
                        {el === "배틀그라운드" && <img src={battle} className="ranking__card__img" alt="game" />}
                        {el === "스타크래프트 리마스터" && <img src={starcraft} className="ranking__card__img" alt="game" />}
                        {/* <img src={""} className="ranking__card__img" alt="game" /> */}
                        <p className="ranking__card__title">{el}</p>      
                    </div>
                </Fragment>
            ))}
            </Slider>
        </div>
    );
};

export default RankingEnt;