import { useRef } from "react";
import axios from "axios";
import styled from "styled-components";

const UploadImage = styled.input`
    display: none;
`

const Upload01 = (props) => {
    const fileRef = useRef(null)

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
        props.onChangeImages(res.data.location, props.index)
        console.log(res.data.location, props.index)
        alert('성공')
    }).catch(err => {
        alert('실패')
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
            props.onChangeImages("", props.index)
        }
    }) 
    .catch(err => {
        alert("error")
    })
    }

    return(
        <>
        {props.images ?
        (<img src={props.images} onClick={imageDelete}/>)
        :
        ( <button type="button" onClick={onClickUpload}>이미지 버튼</button> )
        }
        <UploadImage type={"file"} ref={fileRef} onChange={onChangeFile}/>

        {/* <div className="img-preview">
            <ImgPreview id="img-preview" src={img} onClick={imageDelete} />
            <UploadImage 
              type='file' 
              accept='image/*' 
              id='img' 
              onChange={formSubmit}>
            </UploadImage>
          </div> */}
        </>
    )
}

export default Upload01;