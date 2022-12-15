import { Outlet } from 'react-router-dom';
import  styled  from 'styled-components';
import { ExploreBanner } from './banner/Banner03';
import Aside01 from './aside/Aside01';

const Body = styled.div`
display: flex;
justify-content: center;
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