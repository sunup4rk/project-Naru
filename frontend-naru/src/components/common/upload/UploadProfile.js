import { useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { Modal } from "../modal/Modal";
import Button03 from './../button/Button03';

const UploadImage = styled.input`
    display: none;
`
const Image = styled.img`
    width: 13rem;
    height: 13rem;
    border-radius: 50%;
    border: 2px solid #D1D9DE;
    margin-bottom: 15px;
    cursor: pointer;
`

const UploadProfile = (props) => {
    const fileRef = useRef(null)
    const { Failure } = Modal();

    const onClickUpload = () => {
        fileRef.current?.click();
    }

    const onChangeFile = (e) => {
        const img = e.target.files[0];
        const formData = new FormData();
        formData.append("image", img, img.name);

        axios.post("http://localhost:8080/mypage/profile", formData)
        .then(res => {
            props.onChangeImage(res.data.location, props.index)
        }).catch(err => {
            Failure("이미지 업로드 실패", "이미지 업로드에 실패했습니다.")
        })
    }

    const imageDelete = (e) => {
        axios.delete("http://localhost:8080/mypage/profile", {
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
            Failure("삭제 실패", "이미지 삭제에 실패했습니다.")
        })
    }

    return(
        <>
        {props.profile ?
        (<Image src={props.profile} onClick={imageDelete} alt="upload image" />)
        :
        (<Image src={"/images/icon/user.svg"} alt="profile image" />)
        }
        <Button03 type="button" text={"이미지 선택"} onClick={onClickUpload}/>
        <UploadImage type="file" ref={fileRef} onChange={onChangeFile} />
        </>
    )
}

export default UploadProfile;