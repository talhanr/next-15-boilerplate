import { APIResponseGetUser, GetUserByIdRequestMethodParams } from "@/features/auth/types/types";
import { get, post, put, patch, del } from "./request-handler";
import { ApiResponse, RequestMethodParams } from "./types";

const SERVICE_URLS = {
  login: "/auth/login",
};

const login = (requestParams?: RequestMethodParams) => post({ url: SERVICE_URLS.login, ...requestParams });
const readUser = (requestParams?: GetUserByIdRequestMethodParams): ApiResponse<APIResponseGetUser> => get({ url: SERVICE_URLS.login, ...requestParams });

export const apiServices = {
  login,
  readUser,
};