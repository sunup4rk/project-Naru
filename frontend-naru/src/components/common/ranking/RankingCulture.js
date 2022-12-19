import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Img = styled.img`
    width: 80px;
    height: 120px;
`

const RankingCulture = () => {
    const [ranking, setRanking] = useState();
    const [image, setImage] = useState();

    useEffect(() => {
      const fetchRanikng = () => {
          axios.get("http://localhost:8080/explore/culture")
          .then((response) => {
              if(response.data.message === "영화") {
                setRanking(response.data.result)
                setImage(response.data.image)
              }
          })
      }
      fetchRanikng();
  }, []);
    
    return (
        <div>
            영화 순위
            {ranking?.map((el) => (
            <div key={el}>
                <div>
                    {/* {image?.map((img) => (
                        <Img src={img} alt="movie"/>
                    ))} */}
                </div>
                <div>{el}</div>
            </div>
        ))}
        </div>
    );
};

export default RankingCulture;