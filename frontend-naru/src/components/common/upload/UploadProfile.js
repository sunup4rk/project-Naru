import { useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { Modal } from "../modal/Modal";

const UploadImage = styled.input`
    display: none;
`

const Image = styled.img`
    width: 8rem;
    height: 8rem;
    border-radius: 10px;
    margin: 5px;
`

const UploadProfile = (props) => {
    const fileRef = useRef(null)
    const { Failure } = Modal();

const onClickUpload = () => {
    fileRef.current?.click();
}

const onChangeFile = (e) => {
    console.log(e.target.files[0].name);
    const img = e.target.files[0];
    const formData = new FormData();
    formData.append("image", img, img.name);

    axios.post("http://localhost:8080/image/upload", formData)
    .then(res => {
        props.onChangeImage(res.data.location, props.index)
        // console.log(res.data.location, props.index)
    }).catch(err => {
        Failure("이미지 업로드 실패", "이미지 업로드에 실패했습니다.")
    })
    }

const imageDelete = (e) => {
    console.log(typeof(e.target.src))
    axios.delete("http://localhost:8080/image/delete", {
        params: {
        url: e.target.src     
        }
    })
    .then((response) => {
        if(response.data.message === "삭제 성공") {
            props.onChangeImage("", props.index)
        }
    }) 
    .catch(err => {
        alert("error")
    })
    }

    return(
        <>
        {props.image ?
        (<Image src={props.image} onClick={imageDelete} alt="upload image" />)
        :
        (<Image src={""} alt="profile image" />)
        }
        <button type="button" onClick={onClickUpload}>이미지 선택</button>
        <UploadImage type="file" ref={fileRef} onChange={onChangeFile} />
        </>
    )
}

export default UploadProfile;