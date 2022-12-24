import { useState } from 'react';
import RankingEnt from './ranking/RankingEnt';
import MapCategory from '../../components/common/map/MapCategory';
import Button01 from './../../components/common/button/Button01';
import './Explore.scss';

const Entertainment = () => {
  const [ search, setSearch ] = useState(false);

  const onClickSearch = () => {
    setSearch(true)
  }

  return (
    <div className='explore__wrapper'>
      <RankingEnt />
      <MapCategory search={search} value={"게임방"} />
      <Button01 text={"내 주변 오락시설 찾기"} onClick={onClickSearch}/>
    </div>
  )
};

export default Entertainment;