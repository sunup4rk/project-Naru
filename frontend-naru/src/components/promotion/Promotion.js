import { useNavigate } from 'react-router-dom';
import './Promotion.scss';

const Promotion = () => {
  const navigate = useNavigate()

  const onClickMove = (page) => () => {
    navigate(`/${page}`)
  }

  return (
    <div className="promotion">
      <div className="promotion__list">
        <div className="promotion__item --point" onClick={onClickMove("point")}>
            <img src="/images/icon/point.svg" />
            <div className="promotion__item__right">
              <p>포인트 걸고 게임 한 판!</p>
              <strong>포인트 게임</strong>
          </div>
        </div>
        <div className="promotion__item --qna" onClick={onClickMove("qna")}>
          <img src="/images/icon/qna.svg" />
          <div className="promotion__item__right --padding">
              <p>도움이 필요하신가요?</p>
              <strong>1:1 문의하기</strong>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;