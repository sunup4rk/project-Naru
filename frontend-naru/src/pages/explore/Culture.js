import { useState } from 'react';
import RankingCulture from './ranking/RankingCulture';
import MapCategory from '../../components/common/map/MapCategory';
import Button01 from '../../components/common/button/Button01';
import './Explore.scss';

const Culture = () => {
  const [ search, setSearch ] = useState(false);

  const onClickSearch = () => {
    setSearch(true)
  }

  return (
    <div className='explore-wrapper'>
      <RankingCulture />
        <MapCategory search={search} value={"영화관"} />
        <Button01 text={"내 주변 문화시설 찾기"} onClick={onClickSearch}/>
    </div>
  )
};

export default Culture;