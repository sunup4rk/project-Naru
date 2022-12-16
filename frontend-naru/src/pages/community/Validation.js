import * as yup from "yup";

export const schema = yup.object().shape({
    title: yup.string().required("제목을 입력하세요."),
    address: yup.string().required("주소를 입력하세요."),
    content: yup.string().required("내용을 입력하세요."),
  });