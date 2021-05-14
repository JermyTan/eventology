import { BaseData } from "./base";
import { UserData } from "./users";
import {
  TITLE,
  CREATOR,
  CATEGORY,
  IMAGES,
  START_DATE_TIME,
  END_DATE_TIME,
  VENUE,
  DESCRIPTION,
  SIGN_UP_COUNT,
  LIKE_COUNT,
  HAS_SIGNED_UP,
  HAS_LIKED,
  SIGN_UPS,
  LIKES,
  COMMENTS,
  USER,
  EVENT_ID,
  CONTENT,
} from "../constants";

export type SignUpData = BaseData & {
  [USER]: UserData;
  [EVENT_ID]: number;
};

export type LikeData = SignUpData;

export type CommentData = SignUpData & {
  [CONTENT]: string;
};

export type EventData = BaseData & {
  [TITLE]: string;
  [CREATOR]: UserData;
  [IMAGES]: string[];
  [START_DATE_TIME]: number;
  [END_DATE_TIME]: number;
  [VENUE]: string;
  [DESCRIPTION]: string;
  [SIGN_UP_COUNT]: number;
  [LIKE_COUNT]: number;
  [HAS_SIGNED_UP]: boolean;
  [HAS_LIKED]: boolean;
  [CATEGORY]?: string;
  [SIGN_UPS]?: SignUpData[];
  [LIKES]?: LikeData[];
  [COMMENTS]?: CommentData[];
};
