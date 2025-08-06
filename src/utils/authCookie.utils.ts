// src/utils/authCookie.utils.ts

import { CookieOptions, Response } from "express";

// --- Configuration ---
const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

// Convert expiration times from environment variables to milliseconds, with defaults
const ACCESS_TOKEN_MAX_AGE = parseInt(process.env.JWT_ACCESS_EXPIRATION_MS || '900000', 10); // 15 minutes
const REFRESH_TOKEN_MAX_AGE = parseInt(process.env.JWT_REFRESH_EXPIRATION_MS || '604800000', 10); // 7 days

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // Or "lax" if you need cross-site access
  path: "/",
};

const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: ACCESS_TOKEN_MAX_AGE,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_TOKEN_MAX_AGE,
};


// --- Public Functions ---

/**
 * Sets both access and refresh tokens as HttpOnly cookies in the response.
 * Used for login and signup.
 */
export const sendTokens = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, accessTokenCookieOptions);
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);
};

/**
 * Sets only the access token as an HttpOnly cookie.
 * Used for refreshing the session.
 */
export const sendAccessToken = (res: Response, accessToken: string) => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, accessTokenCookieOptions);
};

/**
 * Clears authentication cookies from the response.
 * Used for logout.
 */
export const clearTokens = (res: Response) => {
  // clearCookie needs the same options (path, domain) to work correctly
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { path: baseCookieOptions.path });
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: baseCookieOptions.path });
};