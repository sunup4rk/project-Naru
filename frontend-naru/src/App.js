import { GlobalStyles } from "./components/common/styles/GlobalStyles"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from 'recoil';
import Header from "./components/layout/header/Header"
import Footer from "./components/layout/footer/Footer"
import Nav01 from './components/layout/navigation/Nav01';
import MainBanner from './components/layout/banner/Banner01';
import { PointBanner, QnaBanner } from "./components/layout/banner/Banner03"
import Cafe from './pages/Cafe';
import SignIn from "./pages/signin/SignIn";
import SignUp from './pages/signup/SignUp';
import ExploreLayout from './components/layout/ExploreLayout';
import Layout from './components/layout/Layout';
import MypageLayout from './components/layout/MypageLayout';
import CommunityLayout from "./components/layout/CommunityLayout";
import Write from './pages/community/Write';
import List from './pages/community/List';

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <RecoilRoot>
          <GlobalStyles />
          <Header category={<Nav01 />} />
          <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<MainBanner />} />
                <Route path="point" element={<PointBanner />} />
                <Route path="qna" element={<QnaBanner />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
              </Route>

              <Route path="community/*" element={<CommunityLayout />}>
                <Route index element={<List />} />
                <Route path="write" element={<Write />} />c
              </Route>

              <Route path="explore/*" element={<ExploreLayout />}>
                <Route path="cafe" element={<Cafe />} />
                <Route path="entertainment" element={<Cafe />} />
                <Route path="culture" element={<Cafe />} />
              </Route>

              <Route path="mypage/*" element={<MypageLayout />}>
                <Route index element={<Cafe />} />
              </Route>
          </Routes>
          <Footer />
        </RecoilRoot>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
