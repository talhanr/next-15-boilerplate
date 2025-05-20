import { ApiResponseDataType, ApiResponseHeaderKeys } from "./enums";

interface Headers {
  [ApiResponseHeaderKeys.HEADERS]: {
    [ApiResponseHeaderKeys.ACCESS_TOKEN]: string;
  };
  [ApiResponseDataType.STATUS]: number;
  [ApiResponseDataType.STATUS_TEXT]: string;
}

interface HeadersData<ApiResponseData> {
  [ApiResponseDataType.SUCCESS]: boolean;
  [ApiResponseDataType.DATA]: ApiResponseData;
}

/**
 * To get Clinet side Response with Types
 * - Works on client.
 */
export interface ClientApiResponse<ApiResponseData> extends Headers {
  [ApiResponseDataType.DATA]: HeadersData<ApiResponseData>;
}

/**
 * To get Server side Response with Types
 * - Works on server.
 */
export type ServerApiresponse<
  ApiResponseData,
  K extends string = ApiResponseDataType.DATA
> = {
  [ApiResponseDataType.SUCCESS]: boolean;
} & { [Key in K]: ApiResponseData };


export interface RequestMethodParams {
  params?: Record<string, any>;
  data?: Record<string, any> | FormData;
  headers?: Record<string, string>;
  config?: RequestInit;
  timeout?: number;
}

export interface RequestParams extends RequestMethodParams {
  url?: string;
  method?: string;
}

export type ApiResponse<T> = Promise<T>;
