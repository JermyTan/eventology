import { EMAIL, NAME, PROFILE_IMAGE_URL } from "../constants";
import { BaseData } from "./base";

export type UserData = BaseData & {
  [NAME]: string;
  [EMAIL]: string;
  [PROFILE_IMAGE_URL]: string;
};
