import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventData } from "../../types/events";

type SingleEventState = {
  event?: EventData;
  isCommenting: boolean;
  inputComment: string;
};

export const singleEventSlice = createSlice({
  name: "singleEvent",
  initialState: {
    isCommenting: false,
    inputComment: "",
  } as SingleEventState,
  reducers: {
    setEvent: (
      state,
      { payload }: PayloadAction<SingleEventState["event"]>,
    ) => {
      state.event = payload;
    },
    setCommenting: (
      state,
      { payload }: PayloadAction<SingleEventState["isCommenting"]>,
    ) => {
      state.inputComment = "";
      state.isCommenting = payload;
    },
    setInputComment: (
      state,
      { payload }: PayloadAction<SingleEventState["inputComment"]>,
    ) => {
      state.inputComment = payload;
    },
    setReplyComment: (
      state,
      { payload }: PayloadAction<{ name: SingleEventState["inputComment"] }>,
    ) => {
      const { name } = payload;

      if (!name) {
        return;
      }

      if (!state.isCommenting) {
        state.isCommenting = true;
        state.inputComment = "";
      }

      const { inputComment } = state;

      state.inputComment =
        !inputComment || inputComment.slice(-1) === " "
          ? `${inputComment}@${payload.name} `
          : `${inputComment} @${payload.name} `;
    },
  },
});

export const { setEvent, setCommenting, setInputComment, setReplyComment } =
  singleEventSlice.actions;

export default singleEventSlice.reducer;
