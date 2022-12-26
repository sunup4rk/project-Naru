import * as yup from "yup";

const nicknamePattern = "^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$";
const passwordPattern = "^[0-9]{12,64}$";

export const schema = yup.object().shape({
    nickname: yup.string().required("닉네임을 입력하세요.").matches(nicknamePattern, "닉네임은 한글,영문,숫자 포함 2~8자여야 합니다."),
    password: yup.string().required("비밀번호를 입력하세요.").matches(passwordPattern, "비밀번호는 12-64자의 숫자여야 합니다."),
    passwordCheck: yup.string().required("비밀번호를 한번 더 입력하세요.").matches(passwordPattern, "비밀번호는 12-64자의 숫자여야 합니다.")
  });