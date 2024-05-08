import { atom } from "recoil";

export const posState = atom<{lat: number, lan: number} | undefined>({
  key: 'posState',
  default: undefined
})