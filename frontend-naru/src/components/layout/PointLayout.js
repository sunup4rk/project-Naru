import { Outlet } from 'react-router-dom';
import { PointBanner } from './banner/Banner03';

const PointLayout = () => {
    return(
      <>
      <PointBanner />
        <Outlet />
      </>
    )
  }
export default PointLayout;