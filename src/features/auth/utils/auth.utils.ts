import localStorage from "../../../utils/localstorage.utils";

export interface CookieOptions {
  path?: string;
  expires?: Date | string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
}
export const getToken = () => getCookie("token");
export const setToken = (token: string) => setCookie("token", token);

export const getUser = () => getCookie("user");
export const setUser = (user: string) => setCookie("user", user);

export const setUserRole = (role: string) =>
  localStorage.store_data("userRole", role);

/**
 * Logout Function: Clears All Authentication Data
 */
export const logout = async (): Promise<boolean> => {
  deleteCookie("token");
  deleteCookie("user");
  localStorage.remove_data("userRole");
  return true;
};

/**
 * Function to Set a Cookie
 * - Works on both client and server.
 * - Supports expiration & HTTP-only flags (if running on the server).
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
) => {
  // CLIENT-SIDE
  if (typeof window !== "undefined") {
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}; path=${options.path ?? "/"}`;
    if (options.expires) {
      const expires =
        options.expires instanceof Date
          ? options.expires.toUTCString()
          : options.expires;
      cookieStr += `; expires=${expires}`;
    }
    if (options.maxAge) cookieStr += `; max-age=${options.maxAge}`;
    if (options.secure) cookieStr += "; secure";
    if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;
    document.cookie = cookieStr;
    return;
  }

  // SERVER-SIDE: return header string
  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; path=${options.path ?? "/"}`;
  if (options.expires) {
    const expires =
      options.expires instanceof Date
        ? options.expires.toUTCString()
        : options.expires;
    cookieStr += `; expires=${expires}`;
  }
  if (options.maxAge) cookieStr += `; max-age=${options.maxAge}`;
  if (options.httpOnly) cookieStr += "; HttpOnly";
  if (options.secure) cookieStr += "; Secure";
  if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
  return cookieStr;
};

/**
 * Function to Get a Cookie
 * - Reads cookies from `document.cookie` (client) or `cookie.parse` (server).
 */
// CLIENT or SERVER
export function getCookie(
  name: string,
  req?: { headers?: { cookie?: string } }
): string | null {
  // CLIENT
  if (typeof window !== "undefined") {
    const match = document.cookie.match(
      new RegExp("(^| )" + encodeURIComponent(name) + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  }
  // SERVER
  else if (req?.headers?.cookie) {
    const cookies = req.headers.cookie.split(";").map((v) => v.trim());
    for (const cookie of cookies) {
      const [key, ...rest] = cookie.split("=");
      if (decodeURIComponent(key) === name) {
        return decodeURIComponent(rest.join("="));
      }
    }
    return null;
  }
  return null;
}

/**
 * Function to Delete a Cookie
 * - Sets the cookie's expiration date in the past.
 */
export function deleteCookie(name: string, options: CookieOptions = {}): void {
  setCookie(name, "", { ...options, expires: "Thu, 01 Jan 1970 00:00:00 GMT" });
}
