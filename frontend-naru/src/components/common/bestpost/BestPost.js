import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BestPost.scss';

const BestPost = () => {
    const [post, setPost] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = () => {
            axios.get("http://localhost:8080/best")
            .then((response) => {
                if(response.data.message === "인기글 조회 성공") {
                    setPost(response.data.result)
                }
            })
        }
        fetchPost();
    }, []);

    const onClickMoveDetail = (el) => (e) => {
        navigate(`/community/detail/${e.target.id}`)
    }

    return (
        <div className="best">
            <h1>인기글</h1>
            <div className="best__posts">
            {post?.map((el) => (
                <div className="best__post" key={el._id}>
                    <div className="best__post__img" id={el._id} onClick={onClickMoveDetail(el)}>
                        {el?.image_address[0] ?
                        <img className="best__post__img--post" id={el._id} src={el?.image_address[0]} alt="post image" />
                        :
                        <img className="best__post__img--default" id={el._id} src="/images/icon/logo02.svg" alt="post image" />
                        }
                    </div>
                    <div className="best__post__content">
                        <h2 id={el._id} onClick={onClickMoveDetail(el)}>{el?.post_title}</h2>
                        <span className="best__post__content__top">{el.writer}</span>
                        <div className="best__post__content__bottom">
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
    );
};

export default BestPost;