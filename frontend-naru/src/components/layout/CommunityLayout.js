import { Outlet } from 'react-router-dom';
import { CommunityBanner } from './banner/Banner03';

const CommunityLayout = () => {
    return(
      <>
        <CommunityBanner />
        <Outlet />
      </>
    )
  }
export default CommunityLayout;