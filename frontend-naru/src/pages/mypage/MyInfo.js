import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/modal/Modal';
import axios from 'axios';
import './MyInfo.scss';
import Post from '../../components/common/post/Post';

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
        {user?.profile ?
          <img src={user?.profile} alt="profile"/> 
          :
          <img src="/images/icon/user.svg" alt="profile"/> 
        }
        <span>{user?.nickname}</span>{" "}<span>님</span>
      </div>

      <div className="myinfo-info">
        <ul>
          <li>
            <span>등급</span>
            {/* <strong>{user?.user_level}</strong> */}
            {user?.user_level === 1 && <img src="images/membership/level1.svg" alt="membership"/>}
            {user?.user_level === 2 && <img src="images/membership/level2.svg" alt="membership"/>}
            {user?.user_level === 3 && <img src="images/membership/level3.svg" alt="membership"/>}
            {user?.user_level === 4 && <img src="images/membership/level4.svg" alt="membership"/>}
            {user?.user_level === 5 && <img src="images/membership/level5.svg" alt="membership"/>}
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
        <div className="myinfo-post__list">
          {user?.like_post.map((el) => (
            <Fragment key={el._id}>
              <Post page={"info"} id={el._id} onClick={onClickMoveDetail(el)} src={el.image_address[0]}
              title={el.post_title} writer={el.writer} time={el.post_time} like={el.like_count}/>
            </Fragment>
            ))}
        </div>
      </div>

      <div className="myinfo-post">
        <div className="myinfo-post__title" onClick={onClickMovePost}>
          <span>내가 쓴 게시글</span>
          <img src="/images/icon/rightArrow.svg" alt="arrow" />
        </div>
        <div className="myinfo-post__list">
          {user?.write_post.map((el) => (
            <Fragment key={el._id}>
              <Post page={"info"} id={el._id} onClick={onClickMoveDetail(el)} src={el.image_address[0]}
              title={el.post_title} writer={el.writer} time={el.post_time} like={el.like_count}/>
            </Fragment>
            ))}
        </div>
      </div>
    </div>
    
  );
};

export default MyInfo;