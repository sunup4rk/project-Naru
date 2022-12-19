import { Outlet } from 'react-router-dom';
import  styled  from 'styled-components';
import { MypageBanner } from './banner/Banner03';
import Aside02 from './Aside/Aside02';

const Body = styled.div`
display: flex;
justify-content: center;
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