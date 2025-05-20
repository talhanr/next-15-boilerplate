import axios from "axios";

import {
  logout,
} from "../utils/auth.util";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
// const API_DOMAIN = "https://localhost:3000";
// const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL;
// oAuth
export const GOOGLE_REDIRECT_URL = `http://accounts.google.com/o/oauth2/v2/auth?client_id=718932924527-4em9535lb3p3nijpdvr41g6aubpqlfmr.apps.googleusercontent.com&redirect_uri=${API_DOMAIN}/login/oauth/google&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&response_type=code&access_type=offline&prompt=consent`;
export const FB_REDIRECT_URL = `https://www.facebook.com/v15.0/dialog/oauth?client_id=898431498260472&redirect_uri=${API_DOMAIN}/login/oauth/facebook&scope=email&response_type=code&auth_type=rerequest&display=popup`;
export const GOOGLE_CONNECT_REDIRECT_URL = `http://accounts.google.com/o/oauth2/v2/auth?client_id=718932924527-4em9535lb3p3nijpdvr41g6aubpqlfmr.apps.googleusercontent.com&redirect_uri=${API_DOMAIN}/user-account-settings/login-and-security-settings?provider=google&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&response_type=code&access_type=offline&prompt=consent`;
export const FB_CONNECT_REDIRECT_URL = `https://www.facebook.com/v15.0/dialog/oauth?client_id=898431498260472&redirect_uri=${API_DOMAIN}/user-account-settings/login-and-security-settings?provider=facebook&scope=email&response_type=code&auth_type=rerequest&display=popup`;

export const BASEURL = API_DOMAIN + "/api";

export async function getApiRequestHeader() {
  // const [authToken, refreshToken] = await Promise.all([
  //   getToken(),
  //   getRefreshToken(),
  // ]);

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // accessToken: authToken,
    // refreshToken: refreshToken,
    lang: JSON.parse(localStorage.getItem("locale")),
  };
}

export const getApiRequestFileHeader = async () => {
  const headers = await getApiRequestHeader();
  const fileHeaders = {
    ...headers,
    Accept: "multipart/form-data",
    "Content-Type": "multipart/form-data",
  };
  instance.defaults.headers = fileHeaders;
  return fileHeaders;
};
//
const instance = axios.create({
  baseURL: BASEURL,
  timeout: 60000,
  withCredentials: true,
  dataType: "jsonp",

});

export async function updateHeaders() {
  const header = await getApiRequestHeader();
  instance.defaults.headers = header;
}

export async function request({ method, url, data, headers }) {
  if (headers === undefined) {
    await updateHeaders();
  }
  const promise = instance[method](url, data);
  let response;
  try {
    response = await promise;
    // if (response?.headers?.accesstoken) {
    //   setToken(response?.headers?.accesstoken);
    // }
  } catch (error) {
    if (error?.response?.data?.message) {
      if (error?.response?.data?.code === 424) {
        global.showModal(
          global.translate(
            `validationMessages.${error?.response?.data?.message}`
          )
        );
      } else {
        global.showError(
          global.translate(
            `validationMessages.${error?.response?.data?.message}`
          )
        );
      }
    }

    if (error?.response?.data?.code === 401) {
      logout();
      window.location = "/unauthorize-access";
    }
    throw error.response;
  }

  return response;
}

export async function newRequest({ method, url, data, headers }) {
  if (headers === undefined) {
    await updateHeaders();
  }
  const promise = instance[method](url, data);
  let response;
  try {
    response = await promise;
    // if (response?.headers?.accesstoken) {
    //   setToken(response?.headers?.accesstoken);
    // }
  } catch (error) {
    if (error?.response?.data?.message) {
      if (error?.response?.data?.code === 424) {
        global.showModal(
          global.translate(
            `validationMessages.${error?.response?.data?.message}`
          )
        );
      } else {
        global.showError(
          global.translate(
            `validationMessages.${error?.response?.data?.message}`
          )
        );
      }
    }
    if (error?.response?.data?.code === 401) {
      logout();
      window.location = "/unauthorize-access";
    }
    throw error.response;
  }

  if (
    response.status
      ? response.status.toString().indexOf("2") !== 0
      : response.data.status.toString().indexOf("2") !== 0
  ) {
    // eslint-disable-next-line
    throw { response };
  } else {
    return response.data;
  }
}

export async function get(url, params, featureAndAction, config) {
  const { filter, ...otherParams } = params ?? {};
  let queryParams = {};

  if (config?.detail) {
    url = `${url}/${filter}`;
    return request({
      method: "get",
      url: url,
      data: { featureAndAction },
      ...config,
    });
  }

  if (filter && !url.includes("filter")) {
    queryParams.filter = JSON.stringify(filter);
  }

  for (const key in otherParams) {
    if (!url.includes(key)) {
      queryParams[key] = otherParams[key];
    }
  }

  const queryString = new URLSearchParams(queryParams);
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return request({
    method: "get",
    url: fullUrl,
    data: { featureAndAction },
    ...config,
  });
}

export async function del(url, params, config) {
  return request({ method: "delete", url, data: { params }, ...config });
}

export async function delWithBody(url, params, config) {
  return request({ method: "delete", url, data: { data: params }, ...config });
}

export async function post(url, data, featureAndAction, config, file) {
  return request({ method: "post", url, data, ...config, file });
}

export async function put(url, data, config) {
  return newRequest({ method: "put", url, data, ...config });
}

export async function patch(url, data, config) {
  return newRequest({ method: "patch", url, data, ...config });
}

export const independentRequest = async (url, method, data) => {
  const promise = axios[method](url, data);
  let response;
  try {
    response = await promise;
  } catch (error) {
    throw error.response;
  }
  const payload = response;
  return payload;
};
