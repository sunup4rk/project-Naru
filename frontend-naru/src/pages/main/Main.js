import Category from '../../components/category/Category';
import BestPost from './../../components/common/post/BestPost';
import Promotion from '../../components/promotion/Promotion';
import './Main.scss';

const Main = () => {
  return (
    <div>
      <Category />
      <BestPost />
      <Promotion />
    </div>
  );
};

export default Main;
