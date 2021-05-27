import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";
import searchReducer from "./slices/search-slice";
import singleEventReducer from "./slices/single-event-slice";
import { loadFromLocalStorage } from "../utils/localStorage-utils";

const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    singleEvent: singleEventReducer,
  },
  preloadedState: { user: loadFromLocalStorage() },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
