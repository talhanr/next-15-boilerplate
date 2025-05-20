import { request } from "./http-provider";
import { ApiResponse, RequestParams } from "./types";

export const get = async <T = any>({
  url,
  params = {},
  ...res
}: RequestParams): ApiResponse<T> => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;  
  return request({ method: "GET", url: fullUrl, params, ...res });
};

export const post = async <T = any>(options: RequestParams): ApiResponse<T> => {
  return request({ method: "POST", ...options });
};

export const put = async <T = any>(options: RequestParams): ApiResponse<T> => {
  return request({ method: "PUT", ...options });
};

export const patch = async <T = any>(options: RequestParams): ApiResponse<T> => {
  return request({ method: "PATCH", ...options });
};

export const del = async <T = any>(options: RequestParams): ApiResponse<T> => {
  return request({ method: "DELETE", ...options });
};