import styled from 'styled-components';

const Wrapper = styled.div`
  width: ${(props) => props.page === "list" && "15rem"};
  width: ${(props) => props.page === "best" && "20rem"};
  width: ${(props) => props.page === "info" && "calc(90%/2.9)" };
  width: ${(props) => props.page === "like" && "calc(90%/4)" };
  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin: 10px;
  margin: ${(props) => props.page === "like" && "5px" };
  `

const Img = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    height: ${(props) => props.page === "list" || props.page === "info" ? "13rem" : ""};
    height: ${(props) => props.page === "best" && "15rem"};
    height: ${(props) => props.page === "like" && "10rem"};
    cursor: pointer;
`

const PostImg = styled.img`
  width: 100%;
  max-height: ${(props) => props.page === "list" || props.page === "info" ? "13rem" : ""};
  max-height: ${(props) => props.page === "best" && "15rem"};
  max-height: ${(props) => props.page === "like" && "10rem"};
  border-radius: 20px 20px 10px 10px;
`

const DefaultImg = styled.img`
  width: 6rem;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  height: 8rem;
  height: ${(props) => props.page === "like" && "7rem"};

  h2 {
    display: -webkit-box; 
    -webkit-box-orient: vertical; 
    -webkit-line-clamp: 1; 
    word-wrap: break-word;
    overflow: hidden; 
    text-overflow: ellipsis;
    font-size: 1.5rem;
    font-size: ${(props) => props.page === "like" && "1.25rem"};
    cursor: pointer;
  }

  .top {
    font-size: 1rem;
    color: #808080;
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-direction: row;
  
    span {
      color: #808080;
      font-size: ${(props) => props.page === "list" || props.page === "info"  || props.page === "like" ? "0.815rem" : ""};
      font-size: ${(props) => props.page === "best" && "1rem"};
    }
  
    img {
      width: 1rem;
      margin-right: 0.4rem;
    }
  }
`

const Post = (props) => {
  return (
    <Wrapper page={props.page}>
      <Img id={props.id} onClick={props.onClick} page={props.page}>
      {props.src ?
      <PostImg id={props.id} src={props.src} alt="post image" page={props.page}/>
      :
      <DefaultImg id={props.id} src="/images/icon/logo02.svg" alt="post image" />
      }
      </Img>
      <Content page={props.page}>
        <h2 id={props.id} onClick={props.onClick}>{props.title}</h2>
        <span className="top">{props.writer}</span>
        <div className="bottom" page={props.page}>
          <span>{props.time}</span>
          <div>
              <img src={"/images/icon/full_heart.svg"} alt="like" />
              {props.like}
          </div>
      </div>
    </Content>
  </Wrapper>
  )
}

export default Post;