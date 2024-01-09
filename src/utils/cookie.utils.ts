type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number;
  path?: string;
};
type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

const COOKIE_ACCESS_TOKEN_NAME = 'app_accesstoken';
const COOKIE_REFRESH_TOKEN_NAME = 'app_refrestoken';
const COOKIE_XSRF_TOKEN_NAME = 'app_xsrftoken';

const getCookie = (name: string, value: string, expires: number): Cookie => {
  const cookie = {
    name,
    value,
    options: {
      httpOnly: false,
      domain:
        process.env.NODE_ENV !== 'production'
          ? 'localhost'
          : process.env.DOMAIN_NAME,
      secure: process.env.NODE_ENV !== 'production' ? false : true,
      maxAge: expires * 1000, //maxAge is milliseconds so 1800 (30minutes) * 1000 = 1800000
    },
  };
  return cookie;
};

const getCookieXsrfToken = (xsrfToken: string, expires: number): Cookie => {
  return getCookie(COOKIE_XSRF_TOKEN_NAME, xsrfToken, expires);
};

const getCookieRefreshToken = (
  refreshToken: string,
  expires: number,
): Cookie => {
  const cookieRefreshTokenName = {
    name: COOKIE_REFRESH_TOKEN_NAME,
    value: refreshToken,
    options: {
      httpOnly: false,
      domain:
        process.env.NODE_ENV !== 'production'
          ? 'localhost'
          : process.env.DOMAIN_NAME,
      secure: process.env.NODE_ENV !== 'production' ? false : false,
      maxAge: expires * 1000,
    },
  };
  return cookieRefreshTokenName;
};

export {
  COOKIE_XSRF_TOKEN_NAME,
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  getCookieXsrfToken,
  getCookieRefreshToken,
};
