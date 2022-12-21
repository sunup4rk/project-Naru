import { useRef } from "react";
import { Modal } from "../modal/Modal";
import axios from "axios";
import styled from "styled-components";

const UploadImage = styled.input`
    display: none;
`

const Button = styled.button`
    width: 8rem;
    height: 8rem;
    background-color: #D1D9DE;
    border: none;
    border-radius: 10px;
    margin: 5px;
    cursor: pointer;
`

const Image = styled.img`
    width: 8rem;
    height: 8rem;
    border-radius: 10px;
    margin: 5px;
    cursor: pointer;
`

const Upload01 = (props) => {
    const fileRef = useRef(null)
    const { Failure } = Modal();

    const onClickUpload = () => {
        fileRef.current?.click();
    }

    const onChangeFile = (e) => {
        const img = e.target.files[0];
        const formData = new FormData();
        formData.append("image", img, props.postId + "/" + img.name);

        axios.post("http://localhost:8080/image/upload", formData)
        .then(res => {
            props.onChangeImages(res.data.location, props.index)
        }).catch( err => {
            Failure("이미지 업로드 실패", "이미지 업로드에 실패했습니다.")
        })
        }

    const imageDelete = (e) => {
        axios.delete("http://localhost:8080/image/delete", {
            params: {
            url: e.target.src     
            }
        })
        .then((response) => {
            if(response.data.message === "삭제 성공") {
                props.onChangeImages("", props.index)
            }
        }) 
        .catch( err => {
            Failure("이미지 삭제 실패", "이미지 삭제에 실패했습니다.")
        })
    }

    return(
        <>
        {props.images ?
        (<Image src={props.images} onClick={imageDelete} alt="upload image" />)
        :
        (<Button type="button" onClick={onClickUpload}>+</Button> )
        }
        <UploadImage type={"file"} ref={fileRef} onChange={onChangeFile} />
        </>
    )
}

export default Upload01;