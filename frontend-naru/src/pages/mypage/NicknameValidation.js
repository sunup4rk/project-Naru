import * as yup from "yup";

const nicknamePattern = "^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$";

export const schema = yup.object().shape({
    nickname: yup.string().required("변경할 닉네임을 입력하세요.").matches(nicknamePattern, "닉네임은 한글,영문,숫자 포함 2~8자여야 합니다."),
  });