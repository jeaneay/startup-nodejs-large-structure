import express from 'express';
import {
  errors,
  appMessage,
  token as tokenUtil,
  cookie,
  pagination,
  sendEmail,
} from '../../utils';
import { db } from '..';
import { appEnv } from '../../config';
import { Op, Transaction } from 'sequelize';

const signUp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
      process.env.NODE_ENV !== 'production'
        ? (req.body.isEmailVerified = true)
        : null;

      //Create user
      const user = await db.User.create(req.body);
      const emailUuid = user.confirmEmailUuid;

      //If company exist we add user in the validation list for company
      if (process.env.NODE_ENV === 'production') {
        const urlEmailValidation =
          process.env.URL_WEBSITE + '/email-validation/' + emailUuid;
        sendEmail.sendConfirmEmail(user.email, urlEmailValidation);
      }

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

const activeAccount = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { userUuid } = req.body;
    if (userUuid) {
      const user = await db.User.findOne({
        where: { confirmEmailUuid: userUuid },
      });
      if (!user) {
        throw new Error(appMessage.user.ERROR_ACCOUNT_NOT_FOUND);
      }
      if (user.isEmailVerified) {
        throw new Error(appMessage.user.ERROR_ACCOUNT_ALREADY_VALIDATED);
      }

      const isUpdated = await db.User.update(
        {
          confirmEmailUuid: null,
          attemptConfirmEmail: 2,
          isEmailVerified: true,
        },
        {
          where: {
            confirmEmailUuid: userUuid,
          },
        },
      );
      if (!isUpdated[0]) {
        throw new Error(appMessage.server.ERROR_UPDATE_RECORD('user'));
      }
      res
        .status(201)
        .json({ response: appMessage.user.SUCCESS_ACCOUNT_VALIDATE });
    } else {
      throw new Error(appMessage.server.MISSED_INFOS);
    }
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};

const forgotPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await db.User.findOne({ where: { email: email } });
      if (!user) {
        throw new Error(appMessage.user.ERROR_ACCOUNT_NOT_FOUND);
      }
      if (!user.isEmailVerified) {
        throw new Error(appMessage.user.ERROR_EMAIL_MUST_CONFIRMED);
      }

      const tokenResetPassword = await tokenUtil.createPasswordToken(
        user,
        '20m',
      );

      const isUpdated = await db.User.update(
        { tokenResetPassword: tokenResetPassword },
        { where: { email: email } },
      );
      if (!isUpdated[0]) {
        throw new Error(appMessage.server.ERROR_UPDATE_RECORD('user'));
      }

      const urlResetPassword =
        process.env.URL_WEBSITE + '/reset-password/' + tokenResetPassword;
      const isSent = await sendEmail.sendResetPasswordEmail(
        user.email,
        urlResetPassword,
      );
      if (!isSent) {
        throw new Error(appMessage.server.ERROR_SENDING_EMAIL);
      }
      res
        .status(201)
        .json({ response: { message: appMessage.server.SUCCESS_EMAIL_SENT } });
    } else {
      throw new Error(appMessage.server.MISSED_INFOS);
    }
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};

const checkTokenResetPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { token } = req.body;
    if (token) {
      const userToken: any = await tokenUtil.getPasswordToken(token);
      if (!userToken) {
        throw new Error(appMessage.server.ERROR_INCORRECT_TOKEN);
      }

      const user = await db.User.findOne({
        where: { tokenResetPassword: token },
      });
      if (!user) {
        throw new Error(appMessage.user.ERROR_TOKEN_RESET_PASSWORD_NOT_FOUND);
      }

      res.status(201).json();
    } else {
      throw new Error(appMessage.server.MISSED_INFOS);
    }
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};

const resetPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { token, password } = req.body;
    if (token && password) {
      const userToken: any = await tokenUtil.getPasswordToken(token);
      if (!userToken) {
        throw new Error(appMessage.server.ERROR_INCORRECT_TOKEN);
      }

      const user = await db.User.findOne({
        where: { tokenResetPassword: token },
      });
      if (!user) {
        throw new Error(appMessage.user.ERROR_TOKEN_RESET_PASSWORD_NOT_FOUND);
      }

      const isUpdated = await db.User.update(
        { password: password, tokenResetPassword: null },
        { where: { tokenResetPassword: token }, individualHooks: true },
      );
      if (!isUpdated[0]) {
        throw new Error(appMessage.server.ERROR_UPDATE_RECORD('user'));
      }

      res
        .status(201)
        .json({
          response: { message: appMessage.user.SUCCESS_PASSWORD_CHANGED },
        });
    } else {
      throw new Error(appMessage.server.MISSED_INFOS);
    }
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};

const refreshToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { cookies } = req;
    if (!cookies || !cookies[cookie.COOKIE_REFRESH_TOKEN_NAME]) {
      throw new Error(appMessage.server.ERROR_NOT_TOKEN);
    }

    const cookieRT = cookies[cookie.COOKIE_REFRESH_TOKEN_NAME];
    const { id } = await tokenUtil.getRefreshToken(cookieRT);

    const tokenBDD = await db.Token.findOne({
      where: { userId: id, refreshToken: cookieRT },
    });
    if (!tokenBDD) {
      throw new Error(appMessage.server.ERROR_NOT_EXIST('refresh token'));
    }

    //const user = await db.User.findByPk(id, { attributes: ['id', 'email', 'roleId', 'roleCompanyId', 'companyId'] });
    const user = await db.User.findByPk(id, {
      attributes: ['id', 'email', 'companyId'],
    });
    if (!user) {
      throw new Error(appMessage.server.ERROR_NOT_EXIST('user'));
    }

    //Create token
    const { accessToken, xsrfToken } = await tokenUtil.createToken(
      user,
      appEnv.JWT_EXPIRESIN,
    );
    const refreshToken = await tokenUtil.createRefreshToken(
      user,
      appEnv.JWT_REFRESH_EXPIRESIN,
    );
    //Update the refresh token in BDD
    tokenBDD.refreshToken = refreshToken;
    await tokenBDD.save();
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

    res.status(200).json({ response: { accessToken } });
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};


export {
  signUp,
  signIn,
  logout,
  activeAccount,
  forgotPassword,
  resetPassword,
  refreshToken,
  checkTokenResetPassword,
};
