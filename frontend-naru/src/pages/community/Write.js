import { useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import DaumPostcode from "react-daum-postcode";
import { Pane, Dialog } from 'evergreen-ui';
import { useForm } from 'react-hook-form';
import { Modal } from './../../components/common/modal/modal';
import './Write.scss';
import axios from 'axios';
import { schema } from './Validation'

const Write = (props) => {
  const [isShown, setIsShown] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue, getValues} = useForm({ 
    resolver: yupResolver(schema),
    mode : 'onChange' 
  });
  const { Success, Warning, Failure } = Modal();

  const onClickAddressSearch = () => {
    setIsShown(true)
  }

  const onCompleteSearch = (postcode) => {
    setValue("address", postcode.address)
    setIsShown(false)
  }

  const onClickSubmit = (data) => {
    console.log(data)
    axios.post("http://localhost:8080/community/write", {
            title: getValues("title"),
            address: getValues("address"),
            addressDetail: getValues("addressDetail"),
            content: getValues("content")
        })
        .then((response) => {
            if(response.data.message === "등록 성공") {
                Success("등록 성공", response.data.message);
            } else {
                Warning("등록 실패", response.data.message);
            }
        }).catch((error) => {
            Failure("등록 실패", "등록에 실패했습니다.")
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
        minHeightContent={"400px"}
      >
        <DaumPostcode onComplete={onCompleteSearch} style={{height:465}}/>
      </Dialog>
    </Pane>  

    <div className="write">
      <form className="write-wrapper" onSubmit={handleSubmit(onClickSubmit)}>
        제목<input type="text" {...register("title")}/>
        <br/>{errors.title?.message}<br/>
        주소<input type="text" {...register("address")}/>
        <br/>{errors.address?.message}<br/>
        <button type="button" onClick={onClickAddressSearch}>주소입력</button>
        상세주소<input type="text" {...register("addressDetail")}/>
        이미지<button type="file">+</button>
        내용<textarea cols="50" rows="10" {...register("content")} style={{resize:"none"}}/>
        <br/>{errors.content?.message}<br/>
        <button type="submit"> {props.isEdit ? "수정" : "등록"}</button>
      </form>
    </div>
    </>
  );
};

export default Write;