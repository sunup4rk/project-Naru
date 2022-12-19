import { Outlet } from 'react-router-dom';
import MainBanner from "./banner/Banner01";

const Layout = () => {
    return(
      <>
        <MainBanner />
        <Outlet />
      </>
    )
  }

export default Layout; 