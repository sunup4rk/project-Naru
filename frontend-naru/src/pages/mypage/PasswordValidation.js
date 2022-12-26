import * as yup from "yup";

const passwordPattern = "^[0-9]{12,64}$";

export const schema = yup.object().shape({
    passwordChange: yup.string().matches(passwordPattern, "비밀번호는 12-64자의 숫자여야 합니다."),
    passwordCheck: yup.string().matches(passwordPattern, "비밀번호는 12-64자의 숫자여야 합니다.")
  });