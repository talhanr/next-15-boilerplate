import { getToken } from "@/features/auth/utils/auth.utils";
import { RequestParams } from "./types";

const STAGING_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASEURL = STAGING_API_URL;

function getApiRequestHeader() {
  const authToken = getToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${authToken}`,
  };
}

export const request = async ({
  method,
  url,
  data,
  headers = {},
  config = {},
  timeout = 10000,
}: RequestParams) => {
  const fullUrl = `${BASEURL}${url}`;

  const defaultHeaders = getApiRequestHeader();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestOptions = {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: data ? JSON.stringify(data) : undefined,
    signal: controller.signal,
    ...config,
  };

  try {
    const response = await fetch(fullUrl, requestOptions);
    clearTimeout(timeoutId);

    const jsonResponse = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // logout();
        // window.location = "/login";
      }
      throw jsonResponse;
    }
    return jsonResponse;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out!");
    }
    console.error("API Request Error:", error);
    throw error;
  }
};
