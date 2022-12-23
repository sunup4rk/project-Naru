import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import axios from 'axios';
import './MyInfo.scss';
import './../community/List.scss';

const MyInfo = () => {
  const [user, setUser] = useState();
  const { Warning } = Modal();
  const navigate = useNavigate();

  useEffect(() => {
      axios.post("http://localhost:8080/islogin")
      .then((response) => {
        if(response.data.message === "로그인 성공") {
          userData();
        }
        else {
          Warning("마이페이지", "로그인이 필요합니다.")
          navigate("/signin")
        }
      })
  }, [])

  const userData = () => {
    axios.get("http://localhost:8080/mypage")
    .then((response) => {
        if(response.data.message === "불러오기") {
          setUser(response.data)
        }
    })
  }

  const onClickMoveDetail = () => (e) => {
    navigate(`/community/detail/${e.target.id}`)
  }

  const onClickMoveLike = () => {
    navigate("/mypage/like")
  }

  const onClickMovePost = () => {
    navigate("/mypage/post")
  }

  return (
    <div className="myinfo">
      <div className="myinfo-profile">
        <img src={user?.profile} alt="profile"/> 
        <span>{user?.nickname}</span>{" "}<span>님</span>
      </div>

      <div className="myinfo-info">
        <ul>
          <li>
            <span>등급</span>
            <strong>{user?.user_level}</strong>
          </li>
          <li>
            <span>포인트</span>
            <div>
            <strong>{user?.user_point}</strong><span>P</span>
            </div>
          </li>
          <li>
            <span>게시글 수</span>
            <strong>{user?.posting_count}</strong>
          </li>
        </ul>
      </div>
      
      <div className="myinfo-post">
        <div className="myinfo-post__title" onClick={onClickMoveLike}>
          <span>좋아요 한 게시글</span>
          <img src="/images/icon/rightArrow.svg" alt="arrow" />
        </div>
        <div className="myinfo-post__postlist">
          {user?.like_post.map((el) => (
              <div className="myinfo-post__postitem" key={el._id}>
                <div className="list__post__img" id={el._id} onClick={onClickMoveDetail(el)}>
                  {el?.image_address[0] ?
                  <img className="list__post__img--post" id={el._id} src={el?.image_address[0]} alt="post image" />
                  :
                  <img className="list__post__img--default" id={el._id} src="/images/icon/logo02.svg" alt="post image" />
                  }
                </div>
                <div className="list__post__content">
                  <h2 id={el._id} onClick={onClickMoveDetail(el)}>{el?.post_title}</h2>
                  <span className="list__post__content__top">{el.writer}</span>
                  <div className="list__post__content__bottom">
                    <span>{el?.post_time}</span>
                      <div>
                          <img src={"/images/icon/full_heart.svg"} alt="like" />
                          {el?.like_count}
                      </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="myinfo-post">
        <div className="myinfo-post__title" onClick={onClickMovePost}>
          <span>내가 쓴 게시글</span>
          <img src="/images/icon/rightArrow.svg" alt="arrow" />
        </div>
        <div className="myinfo-post__postlist">
          {user?.write_post.map((el) => (
              <div className="myinfo-post__postitem" key={el._id}>
                <div className="list__post__img" id={el._id} onClick={onClickMoveDetail(el)}>
                  {el?.image_address[0] ?
                  <img className="list__post__img--post" id={el._id} src={el?.image_address[0]} alt="post image" />
                  :
                  <img className="list__post__img--default" id={el._id} src="/images/icon/logo02.svg" alt="post image" />
                  }
                </div>
                <div className="list__post__content">
                  <h2 id={el._id} onClick={onClickMoveDetail(el)}>{el?.post_title}</h2>
                  <span className="list__post__content__top">{el.writer}</span>
                  <div className="list__post__content__bottom">
                    <span>{el?.post_time}</span>
                      <div>
                          <img src={"/images/icon/full_heart.svg"} alt="like" />
                          {el?.like_count}
                      </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
    
  );
};

export default MyInfo;