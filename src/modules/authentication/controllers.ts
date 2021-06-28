import express from 'express';
import {
  errors,
  appMessage,
  token as tokenUtil,
  cookie,
} from '../../utils';
import { db } from '..';
import { appEnv } from '../../config';

const signUp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
      //If development validate automatically the email
      process.env.NODE_ENV !== 'production'
        ? (req.body.isEmailVerified = true)
        : null;

      //Create user
      const user = await db.User.create(req.body);

      res
        .status(201)
        .json({ response: appMessage.server.SUCCESS_SIGNIN, user: user.id });
  } catch (error) {
    next(new errors.httpRequest.BadRequestError(error));
  }
};

const signIn = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await db.User.scope({
        method: ['findByLogin', email],
      }).findOne();

      if (!user) {
        throw new Error(appMessage.user.ERROR_LOGIN);
      }

      if (!user.isEmailVerified) {
        throw new Error(appMessage.user.ERROR_EMAIL_NOT_VERIFIED);
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error(appMessage.user.ERROR_MDP);
      }
      //DELETE 6h after the test
      //Create token
      const { accessToken, xsrfToken } = await tokenUtil.createToken(
        user,
        appEnv.JWT_EXPIRESIN,
      );
      const refreshToken = await tokenUtil.createRefreshToken(
        user,
        appEnv.JWT_REFRESH_EXPIRESIN,
      );
      //Add the refresh token in BDD
      const token = await new db.Token();
      await token.createTokenByUser(user.id, refreshToken);
      //Create cookie for token
      const cookieXsrfToken = cookie.getCookieXsrfToken(
        xsrfToken,
        appEnv.JWT_EXPIRESIN,
      );
      const cookieRefreshToken = cookie.getCookieRefreshToken(
        refreshToken,
        appEnv.JWT_REFRESH_EXPIRESIN,
      );
      res.cookie(
        cookieRefreshToken.name,
        cookieRefreshToken.value,
        cookieRefreshToken.options,
      );
      res.cookie(
        cookieXsrfToken.name,
        cookieXsrfToken.value,
        cookieXsrfToken.options,
      );

      res.status(200).json({ response: { accessToken, status: user.status } });
    } else {
      throw new Error(appMessage.server.ERROR_SIGNIN);
    }
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};

const logout = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    res.clearCookie(cookie.COOKIE_REFRESH_TOKEN_NAME);
    res.clearCookie(cookie.COOKIE_XSRF_TOKEN_NAME);
    res.status(200).json();
  } catch (error) {
    next(new errors.httpRequest.BadRequestError(error));
  }
};


export {
  signUp,
  signIn,
  logout,
};
