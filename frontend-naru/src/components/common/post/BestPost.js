import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';
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
                <Fragment key={el._id}>
                    <Post page={"best"} id={el._id} onClick={onClickMoveDetail(el)} src={el.image_address[0]}
                    title={el.post_title} writer={el.writer} time={el.post_time} like={el.like_count}/>
                </Fragment>
            ))}
            </div>
        </div>
    );
};

export default BestPost;