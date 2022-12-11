import { GlobalStyles } from "./components/common/styles/GlobalStyles"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from "./components/layout/header/Header"
import Footer from "./components/layout/footer/Footer"
import Banner from "./components/layout/banner/Banner"
import Contents from "./pages/Contents"
import Nav01 from './components/layout/navigation/Nav01';
import Nav02 from './components/layout/navigation/Nav02';
import Nav03 from './components/layout/navigation/Nav03';


function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header category={<Nav01 />} logout={<Nav02 />} login={<Nav03 />} />

      <Banner>
      {/* <Routes> */}
        {/* <Route index element={<MainBanner01 />}/> */}
        {/* <Route path="/explore/cafe" element={<CafeBanner />} /> */}

      {/* </Routes> */}
      </Banner>

      {/* <Aside01 /> */}
      {/* <Aside02 /> */}

      <Contents>
        {/* <Routes> */}
          {/* <Route path="/" element={<Main category={<A />} top={<B />} banner={<C />} />} /> */}
          {/* <Route path="/explore/cafe" element={<Cafe />} /> */}
        {/* </Routes> */}
      </Contents>
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;