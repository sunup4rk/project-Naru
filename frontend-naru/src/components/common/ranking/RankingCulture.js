import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import uuid from 'react-uuid';

const Img = styled.img`
    width: 80px;
    height: 120px;
`

const RankingCulture = () => {
    const [ranking, setRanking] = useState();

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

    return (
        <div>
            영화 순위
            {ranking?.map((el) => (
            <div key={uuid()}>
                <div>{el.title}</div>
                <img src={el.titleimg} />
            </div>
        ))}
        </div>
    );
};

export default RankingCulture;