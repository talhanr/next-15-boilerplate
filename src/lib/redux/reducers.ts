import authSlice from "@/features/auth/redux/authSlice";
import { combineReducers } from "@reduxjs/toolkit";

const reducers = {
  auth: authSlice,
  // Add other slices here
};

export const reducer = combineReducers(reducers);
