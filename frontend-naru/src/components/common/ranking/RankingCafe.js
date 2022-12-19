import { useEffect, useState } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

const RankingCafe = () => {
    const [ranking, setRanking] = useState();

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
  
    return (
        <div>
            카페 순위
            {ranking?.map((el) => (
            <div key={uuid()}>
                <div>이미지</div>
                <div>{el}</div>
            </div>
        ))}
        </div>
    );
};

export default RankingCafe;