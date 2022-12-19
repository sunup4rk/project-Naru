import { useEffect, useState } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

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

    return (
        <div>
            게임 순위
            {ranking?.map((el) => (
            <div key={uuid()}>
                <div>이미지</div>
                <div>{el}</div>
            </div>
        ))}
        </div>
    );
};

export default RankingEnt;