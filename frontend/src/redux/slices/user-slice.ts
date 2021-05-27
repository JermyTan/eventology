import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/users";

export const userSlice = createSlice({
  name: "user",
  initialState: null as User | null,
  reducers: {
    updateUser: (_, { payload }: PayloadAction<User | null>) => payload,
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
