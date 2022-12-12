import { GlobalStyles } from "./components/common/styles/GlobalStyles"
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from "./components/layout/header/Header"
import Footer from "./components/layout/footer/Footer"
import Nav01 from './components/layout/navigation/Nav01';
import Nav02 from './components/layout/navigation/Nav02';
import Nav03 from './components/layout/navigation/Nav03';
import Banner01 from './components/layout/banner/Banner01';
import { ExploreBanner, CommunityBanner, PointBanner, QnaBanner } from "./components/layout/banner/Banner03"
import Aside01 from "./components/layout/Aside/Aside01"
import Aside02 from "./components/layout/Aside/Aside02"
import Cafe from './pages/Cafe';

const Body = styled.div`
  display: flex;
  justify-content: center;
`


function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header category={<Nav01 />} logout={<Nav02 />} login={<Nav03 />} />


      <Routes>
        <Route path="/" element={<Banner01 />} />
        <Route path="/explore/*" element={<ExploreBanner />} />
        <Route path="/community/*" element={<CommunityBanner />} />
        <Route path="/point" element={<PointBanner />} />
        <Route path="/qna" element={<QnaBanner />} />
      </Routes>

      <Body>
          <Routes>
            <Route path="/explore/*" element={<Aside01 />} />
            <Route path="/mypage/*" element={<Aside02 />} />
          </Routes>

          <Routes>
            {/* <Route path="/" element={<Main category={<A />} top={<B />} banner={<Banner02 />} />} /> */}
            <Route path="/explore/cafe" element={<Cafe />} />
          </Routes>
      </Body>
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;