import './Write.scss';

const Detail = () => {

  return (
    <>
    <div className="detail">
      <form className="detail-wrapper">
        제목<input type="text" />
        주소<input type="text" />
        상세주소<input type="text" />
        이미지<button type="file" >+</button>
        내용<textarea cols="50" rows="10"  style={{resize:"none"}}/>
      <button>등록</button>
      <button>수정</button>
      </form>
    </div>
    </>
  );
};

export default Detail;