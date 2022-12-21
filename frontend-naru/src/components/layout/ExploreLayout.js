import { Outlet } from 'react-router-dom';
import { ExploreBanner } from './banner/Banner03';
import Aside01 from './aside/Aside01';
import styled from 'styled-components';

const Body = styled.div`
  display: flex;
  justify-content: space-around;
  width: 90%;
  max-width: 1200px;
  padding: 100px 0;
  margin: 0 auto;
`

const ExploreLayout = () => {
    return(
      <>
      <ExploreBanner />
      <Body>
        <Aside01 />
        <Outlet />
      </Body>
      </>
    )
  }
export default ExploreLayout;