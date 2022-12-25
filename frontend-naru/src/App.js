import { GlobalStyles } from "./components/common/styles/GlobalStyles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import Nav01 from "./components/layout/navigation/Nav01";
import { QnaBanner } from "./components/layout/banner/Banner03";
import Cafe from "./pages/explore/Cafe";
import Entertainment from "./pages/explore/Entertainment";
import Culture from "./pages/explore/Culture";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import ExploreLayout from "./components/layout/ExploreLayout";
import Layout from "./components/layout/Layout";
import MypageLayout from "./components/layout/MypageLayout";
import CommunityLayout from "./components/layout/CommunityLayout";
import PointLayout from "./components/layout/PointLayout";
import Write from "./pages/community/Write";
import List from "./pages/community/List";
import Detail from "./pages/community/Detail";
import Edit from "./pages/community/Edit";
import MyInfo from "./pages/mypage/MyInfo";
import MyEdit from "./pages/mypage/MyEdit";
import MyLike from "./pages/mypage/MyLike";
import MyPost from "./pages/mypage/MyPost";
import MyEditpw from "./pages/mypage/MyEditpw";
import Contents from './pages/main/Contents';
import Point from "./pages/point/Point";
import MyQna from "./pages/mypage/MyQna";
import Qna from "./pages/qna/Qna";
import QnaLayout from "./components/layout/QnaLayout";

function App() {
  return (
    <BrowserRouter>
        <RecoilRoot>
          <GlobalStyles />
          <Header category={<Nav01 />} />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Contents />} />
            </Route>

            <Route path="point" element={<PointLayout />}>
              <Route index element={<Point />} />
            </Route>
            <Route path="qna" element={<QnaLayout />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
              
            <Route path="community/*" element={<CommunityLayout />}>
              <Route index element={<List />} />
              <Route path="write" element={<Write />} />
              <Route path="detail/:id" element={<Detail />} />
              <Route path="edit/:id" element={<Edit />} />
            </Route>

            <Route path="explore/*" element={<ExploreLayout />}>
              <Route path="cafe" element={<Cafe />} />
              <Route path="entertainment" element={<Entertainment />} />
              <Route path="culture" element={<Culture />} />
            </Route>

            <Route path="mypage/*" element={<MypageLayout />}>
              <Route index element={<MyInfo />} />
              <Route path="edit" element={<MyEdit />} />
              <Route path="editpw" element={<MyEditpw />} />
              <Route path="like" element={<MyLike />} />
              <Route path="post" element={<MyPost />} />
              <Route path="qna" element={<MyQna />} />
            </Route>
          </Routes>
          <Footer />
        </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
