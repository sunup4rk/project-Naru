import { Outlet } from 'react-router-dom';
import { MypageBanner } from './banner/Banner03';
import Aside02 from './aside/Aside02';
import styled from 'styled-components';

const Body = styled.div`
  display: flex;
  justify-content: space-around;
  width: 90%;
  max-width: 1200px;
  padding: 100px 0;
  margin: 0 auto;
`

const MypageLayout = () => {
    return(
      <>
      <MypageBanner />
      <Body>
        <Aside02 />
        <Outlet />
      </Body>
      </>
    )
  }
export default MypageLayout;