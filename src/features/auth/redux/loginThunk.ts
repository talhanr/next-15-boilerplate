import { apiServices } from "@/services/fetch/api-services";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginFormValues } from "../validations/login-schema";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: LoginFormValues, { rejectWithValue }) => {
    try {
      const response = await apiServices.readUser({ data: credentials });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
