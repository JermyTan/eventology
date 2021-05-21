import { USER_ID } from "../constants";

export const LOGIN_PATH = "/";
export const EVENTS_PATH = "/events";
export const EVENTS_SINGLE_VIEW_PATH = "/events/:eventId";
export const PROFILE_MAIN_PATH = `/profile/:${USER_ID}`;
export const PROFILE_LIKES_PATH = `/profile/:${USER_ID}/likes`;
export const PROFILE_GOING_PATH = `/profile/:${USER_ID}/going`;
export const PROFILE_PAST_PATH = `/profile/:${USER_ID}/past`;
