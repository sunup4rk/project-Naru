import { useState } from 'react';
import RankingCafe from './ranking/RankingCafe';
import MapCategory from './../../components/common/map/MapCategory';
import Button01 from './../../components/common/button/Button01';
import './Explore.scss';

const Cafe = () => {
  const [ search, setSearch ] = useState(false);

  const onClickSearch = () => {
    setSearch(true)
  }

  return (
    <div className="explore__wrapper">
      <RankingCafe />
        <MapCategory search={search} value={"카페"} />
        <Button01 text={"내 주변 카페 찾기"} onClick={onClickSearch}/>
    </div>
  )
};

export default Cafe;