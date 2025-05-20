import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./loginThunk";
import { AuthState } from "../types/types";

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export default authSlice.reducer;
export const { setUser } = authSlice.actions;
