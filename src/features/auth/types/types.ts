import { ClientApiResponse, RequestMethodParams, ServerApiresponse } from "@/services/fetch/types";
import { UserCommonKeys, UserKeys } from "../enums/enums";

export interface User {
  [UserKeys.ID]: string;
  [UserKeys.USER_NAME]: string;
  [UserKeys.FIRST_NAME]: string;
  [UserKeys.LAST_NAME]: string;
  [UserKeys.EMAIL]: string;
  [UserKeys.ROLE]: string;
}

export interface AuthState {
    [UserCommonKeys.USER]: User | null;
    [UserCommonKeys.IS_LOADING]: boolean;
}

export interface GetUserByIdRequestMethodParams extends RequestMethodParams {}
export interface APIResponseGetUser extends ClientApiResponse<User> {}
export interface APIResponseServerGetUser extends ServerApiresponse<User, UserCommonKeys.USER> {}
