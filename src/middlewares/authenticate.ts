import express from 'express';
import { errors, appMessage, cookie, token } from '../utils';

// Allow to check if token is valid
const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<express.NextFunction | void> => {
  try {
    const accessToken = token.getHeadersToken(req);
    const { cookies } = req;

    if (!accessToken) {
      throw new Error(appMessage.server.ERROR_NOT_TOKEN);
    }

    if (!cookies || !cookies[cookie.COOKIE_XSRF_TOKEN_NAME]) {
      throw new Error(appMessage.server.ERROR_NOT_XSRF_TOKEN);
    }

    const xsrfToken = cookies[cookie.COOKIE_XSRF_TOKEN_NAME];

    const user = await token.getInfosToAccessToken(accessToken);
    if (user.xsrfToken !== xsrfToken) {
      throw new Error(appMessage.server.ERROR_BAD_XSRF_TOKEN);
    }
  
    req.body.context = user;
    next();
  } catch (error) {
    //Allow to delete file if is upload before authenticate
    next(new errors.httpRequest.RequestError(error, 401));
  }
};

export default { authenticate };
