import { GlobalStyles } from "./components/common/styles/GlobalStyles"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Header from "./components/layout/header/Header"
import MainBanner01 from "./components/layout/banner/MainBanner01"
import Footer from "./components/layout/footer/Footer"
import Banner from "./components/layout/banner/Banner"
import Contents from "./pages/Contents"


function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />

      <Banner>
      <Routes>
        <Route path="/" element={<MainBanner01 />}/>
        {/* <Route path="/" */}
      </Routes>
      </Banner>

      <Contents>
        <Routes>
      {/* <Aside/> */}
        </Routes>
      </Contents>
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;