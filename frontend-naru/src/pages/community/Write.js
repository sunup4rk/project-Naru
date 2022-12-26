import { useState, useEffect } from 'react';
import { Pane, Dialog } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Modal } from './../../components/common/modal/Modal';
import Upload01 from '../../components/common/upload/Upload01';
import MapPost from '../../components/common/map/MapPost';
import DaumPostcode from "react-daum-postcode";
import Button01 from './../../components/common/button/Button01';
import Button02 from '../../components/common/button/Button02';
import Button03 from '../../components/common/button/Button03';
import axios from 'axios';
import uuid from 'react-uuid'
import './Write.scss';

const Write = () => {
  const [isShown, setIsShown] = useState(false);
  const [images, setImages] = useState(["","","",""]);
  const [postId, setPostId] = useState();
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      postId: 0,
    } ,
    mode : 'onChange' 
  });
  const { Success, Warning, Failure } = Modal();
  const navigate = useNavigate();

  useEffect(() => {
    const getPostId = () => {
      axios.get("http://localhost:8080/community/write")
      .then((response) => {
        if(response.data) {
          setPostId(response.data.postId)
        }
      })
    }
    getPostId();
  }, []);

  const onClickAddressSearch = () => {
    setIsShown(true)
  }

  const onCompleteSearch = (postcode) => {
    setValue("address", postcode.address)
    setIsShown(false)
  }

  const onChangeImages = (img, index) => {
    const newImages = [...images];
    newImages[index] = img;
    setImages(newImages);
  }

  const onClickSubmit = (data) => {
    if(!data.title) {
      Warning("등록 실패", "제목을 입력하세요.")
    } else if (!data.address) {
      Warning("등록 실패", "주소를 입력하세요.")
    } else if (!data.content) {
      Warning("등록 실패", "내용을 입력하세요.")
    } else {
      axios.post("http://localhost:8080/community/write", {
        title: data.title,
        address: data.address,
        addressDetail: data.addressDetail,
        content: data.content,
        postId : postId
      })
      .then((response) => {
          if(response.data.message === "등록 성공") {
            Success("등록 성공", "게시물이 등록되었습니다.");
            navigate("/community")
          } else {
            Warning("등록 실패", response.data.message);
          }
      }).catch((error) => {
        Failure("등록 실패", "등록에 실패했습니다.")
      })
    }
  }

  const onClickCancel = () => {
      axios.delete(`http://localhost:8080/community/delete/${postId}`)
      .then((response) => {
          if(response.data.message === "삭제 완료") {
            navigate(-1);
          }
      })
}

  return (
    <>
      <Pane>
      <Dialog
        isShown={isShown}
        title="주소 검색"
        onCloseComplete={() => setIsShown(false)}
        hasFooter={false}
        minHeightContent={"400px"}>
        <DaumPostcode onComplete={onCompleteSearch} style={{height:465}}/>
      </Dialog>
    </Pane>  

    <div className="write">
      <form className="write__form" onSubmit={handleSubmit(onClickSubmit)}>
        <div className="write__input">
          <input className="write__input__title" type="text" {...register("title")} placeholder="제목을 입력하세요." />

          <div className="write__input__location">
            <MapPost address={getValues("address")}/>
            <div className="write__input__location__address">
              <Button03 type={"button"} text={"주소 찾기"} onClick={onClickAddressSearch} />
              <input className="write__input__location__address " type="text" {...register("address")} placeholder="주소를 입력하세요." readOnly/>
              <input className="write__input__location__address" type="text" {...register("addressDetail")} placeholder="상세주소를 입력하세요." />
            </div>
          </div>

          <div className="write__input__image">
          {images.map((el, index) => (
            <Upload01 key={uuid()} postId={postId} onChangeImages={onChangeImages} index={index} images={el}/>
          ))}
          </div>

          <textarea cols="50" rows="10" {...register("content")} placeholder="내용을 입력하세요." />
        </div>
        <div className="write__button">
          <Button01 type={"submit"} text={"등록"} size={"s"}/>
          <Button02 type={"button"} text={"취소"} size={"s"} onClick={onClickCancel}/>
        </div>
      </form>
    </div>
    </>
  );
};

export default Write;