import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { User } from "../../types/users";

export const userSlice = createSlice({
  name: "user",
  initialState: null as User | null,
  reducers: {
    updateUser: (_, action: PayloadAction<User | null>) => action.payload,
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
