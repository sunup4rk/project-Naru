import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';

const  PrevArrow = styled.div`
`
const  NextArrow = styled.div`
`
const Slide = styled(Slider)`
  .slick-slider {
    width: 100%;
  }

  .slick-prev::before {
    display: none;
  }

  .slick-next::before {
    display: none;
  }
`

const Card = styled.div`
`

const SlideRanking = (props) => {
  
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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

  return(
    <Slide {...settings}>
      <div className="ranking__card">
          <img src={props.image}>이미지</img>
          <div className="ranking__card__title">{props.title}</div>
      </div>
    </Slide>
  )
}

export default SlideRanking;