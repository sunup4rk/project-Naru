import axios from 'axios';
import { useEffect, useState } from 'react';

const Bestpost = () => {
    const [post, setPost] = useState([])

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

    return (
        <div>
            인기글
            {post?.map((el) => (
                <div key={el._id}>
                    <img src={el?.image_address} alt="post_img" />
                    <div>제목</div>{el?.post_title}
                    <div>날짜</div>{el?.post_time}
                    <div>좋아요</div>{el?.like_count}
                </div>
            ))}
            <hr/>
            <hr/>
            <hr/>
        </div>
    );
};

export default Bestpost;