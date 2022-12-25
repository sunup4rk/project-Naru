import { useNavigate } from 'react-router-dom';
import './Category.scss';

const Category = () => {
  const navigate = useNavigate();

  const onClickMove = (page) => () => {
    navigate(`/explore/${page}`)
  }

  return (
    <div className="category">
      <h1>찾아보기</h1>
      <div className="category__list">
        <div className="category__item" onClick={onClickMove("cafe")}>
          <div className="category__item__cafe">
            <span>카페</span>
            </div>
        </div>
        <div className="category__item" onClick={onClickMove("entertainment")}>
          <div className="category__item__ent">
            <span>오락</span>
          </div>
        </div>
        <div className="category__item" onClick={onClickMove("culture")}>
          <div className="category__item__culture">
            <span>문화</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;