import { ACCESS, EMAIL, PASSWORD, REFRESH } from "../constants";
import { UserData } from "./users";

export type AuthenticationData = UserData & {
  [ACCESS]: string;
  [REFRESH]: string;
};

export type AuthenticationPostData = {
  [EMAIL]: string;
  [PASSWORD]: string;
};
