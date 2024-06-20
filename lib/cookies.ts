import { LoggedUser } from "@/stores/types";
import Cookies from "js-cookie";

const COOKIE_NAME = "RCUserCookie";
const EXPIRE_IN_DAYS = 2;

export const getUserFromCookie = () => {
  const userCookie = Cookies.get(COOKIE_NAME);
  return userCookie ? JSON.parse(userCookie) : null;
}

export const setRCUserCookie = (user: LoggedUser) => {
  Cookies.set(COOKIE_NAME, JSON.stringify(user), { expires: EXPIRE_IN_DAYS });
}

export const removeRCUserCookie = () => {
  Cookies.remove(COOKIE_NAME);
}
