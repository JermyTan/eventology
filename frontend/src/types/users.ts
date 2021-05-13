import { EMAIL, NAME } from "../constants";
import { BaseData } from "./base";

export type UserData = BaseData & {
  [NAME]: string;
  [EMAIL]: string;
};
