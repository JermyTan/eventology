import {
  ACCESS,
  EMAIL,
  ID,
  NAME,
  PROFILE_IMAGE_URL,
  REFRESH,
} from "../constants";
import { BaseData } from "./base";

export type UserData = BaseData & {
  [NAME]: string;
  [EMAIL]: string;
  [PROFILE_IMAGE_URL]: string;
};

export type User = {
  [ID]: number;
  [NAME]: string;
  [EMAIL]: string;
  [PROFILE_IMAGE_URL]: string;
  [ACCESS]: string;
  [REFRESH]: string;
};
