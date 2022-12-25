import { atom } from 'recoil';

export const loginState = atom({
  key: 'loginState', 
  default: false,
});

export const postIdState = atom({
  key: 'postIdState', 
  default: 0,
});