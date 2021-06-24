import { appEnv } from '../config';
import { IUserAttributes } from '../modules/users/models/user';
import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import express from 'express';

type CreateToken = {
  xsrfToken: string;
  accessToken: string;
};
type RefreshToken = {
  id: string;
  email: string;
};
type AccessToken = {
  id: string;
  email: string;
  companyId: number;
  xsrfToken: string;
};

// Allow to get if token exist
const getHeadersToken = (req: express.Request): string | null => {
  if (req.headers['x-token']) {
    return req.headers['x-token'].toString();
  } else if (req.headers['x-access-token']) {
    return req.headers['x-access-token'].toString();
  } else if (req.headers.authorization) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const createXsrfToken = async (): Promise<string> => {
  const randomNumber = Math.floor(Math.random() * (30 - 15 + 1) + 15);
  return cryptoRandomString.async({ length: randomNumber, type: 'base64' });
};

const createToken = async (
  user: IUserAttributes,
  expires: number = appEnv.JWT_EXPIRESIN,
): Promise<CreateToken> => {
  try {
    const xsrfToken = await createXsrfToken();
    //const { id, email, roleId, roleCompanyId, companyId } = user;
    const { id, email, companyId } = user;
    const accessToken = await jwt.sign(
      { id, email, companyId, xsrfToken },
      appEnv.JWT_SECRET,
      { expiresIn: expires },
    );
    return { xsrfToken, accessToken };
  } catch (error) {
    return error;
  }
};

const getInfosToAccessToken = async (accessToken: string): Promise<AccessToken> => {
  try {
    const infos: any = await jwt.verify(
      accessToken.toString(),
      appEnv.JWT_SECRET,
    );
    return infos;
  } catch (error) {
    return error;
  }
};

const createRefreshToken = async (
  user: IUserAttributes,
  expires: number = appEnv.JWT_REFRESH_EXPIRESIN,
): Promise<string> => {
  try {
    const { id, email } = user;
    const refreshToken = await jwt.sign(
      { id, email },
      appEnv.JWT_REFRESH_SECRET,
      { expiresIn: expires },
    );
    return refreshToken;
  } catch (error) {
    return error;
  }
};

const getRefreshToken = async (token: string): Promise<RefreshToken> => {
  try {
    const infos: any = await jwt.verify(
      token.toString(),
      appEnv.JWT_REFRESH_SECRET,
    );
    return infos;
  } catch (error) {
    return error;
  }
};

const createPasswordToken = async (
  user: IUserAttributes,
  expires: number | string = appEnv.JWT_RESET_PASSWORD_EXPIRESIN,
): Promise<string> => {
  try {
    const { id, email } = user;
    const resetPasswordToken = await jwt.sign(
      { id, email },
      appEnv.JWT_RESET_PASSWORD_SECRET,
      { expiresIn: expires },
    );
    return resetPasswordToken;
  } catch (error) {
    return error;
  }
};

const getPasswordToken = async (token: string): Promise<string> => {
  try {
    const infos: any = await jwt.verify(
      token.toString(),
      appEnv.JWT_RESET_PASSWORD_SECRET,
    );
    return infos;
  } catch (error) {
    return error;
  }
};

export {
  getHeadersToken,
  createXsrfToken,
  createToken,
  getInfosToAccessToken,
  createRefreshToken,
  getRefreshToken,
  createPasswordToken,
  getPasswordToken,
};
