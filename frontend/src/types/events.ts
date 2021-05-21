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
  NAME,
  USER_ID,
  OFFSET,
  LIMIT,
  IDS,
  EVENT,
  EVENT_DETAILS,
} from "../constants";

export type EventCategoryData = BaseData & {
  [NAME]: string;
};

export type EventSignUpData = BaseData & {
  [USER]: UserData;
  [EVENT_ID]?: number;
  [EVENT]?: EventData;
};

export type EventSignUpPostData = {
  [EVENT_ID]: number;
};

export type EventSignUpDeleteData = EventSignUpPostData;

export type EventLikeData = EventSignUpData;

export type EventLikePostData = EventSignUpPostData;

export type EventLikeDeleteData = EventSignUpDeleteData;

export type EventCommentData = EventSignUpData & {
  [CONTENT]: string;
};

export type EventCommentPostData = EventSignUpPostData & {
  [CONTENT]: string;
};

export type EventCommentDeleteData = {
  [IDS]: number[];
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
  [SIGN_UPS]?: EventSignUpData[];
  [LIKES]?: EventLikeData[];
  [COMMENTS]?: EventCommentData[];
};

export type EventGetQueryParams = {
  [USER_ID]?: number | string | null;
  [CATEGORY]?: string | null;
  [START_DATE_TIME]?: number | string | null;
  [END_DATE_TIME]?: number | string | null;
  [OFFSET]?: number | string | null;
  [LIMIT]?: number | string | null;
};

export type EventSignUpGetQueryParams = {
  [USER_ID]?: number | string | null;
  [EVENT_ID]?: number | string | null;
  [EVENT_DETAILS]?: number | boolean | null;
};
