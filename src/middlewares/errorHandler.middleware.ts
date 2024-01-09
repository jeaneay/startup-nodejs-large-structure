import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '../constants/commons'
import {
  BadRequestError,
  ConflictError,
  DatabaseError,
  ForbiddenError,
  GatewayTimeoutError,
  NotFoundError,
  NotImplementedError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError
} from '../helpers/errors'
import { sendErrorResponse } from '../utils/errors'

export class ErrorHandlingMiddleware {
  constructor() {}
  public static handleErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error('Error:', err.stack)

    switch (true) {
      case err instanceof NotFoundError:
        return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, err.message)
      case err instanceof DatabaseError:
        return sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER, err.message)
      case err instanceof BadRequestError:
        return sendErrorResponse(res, HTTP_STATUS.BAD, err.message)
      case err instanceof ValidationError:
        return sendErrorResponse(res, HTTP_STATUS.BAD, err.message)
      case err instanceof UnauthorizedError:
        return sendErrorResponse(res, HTTP_STATUS.UNAUTHORIZED, err.message)
      case err instanceof ForbiddenError:
        return sendErrorResponse(res, HTTP_STATUS.FORBIDDEN, err.message)
      case err instanceof ConflictError:
        return sendErrorResponse(res, HTTP_STATUS.CONFLICT, err.message)
      case err instanceof TooManyRequestsError:
        return sendErrorResponse(
          res,
          HTTP_STATUS.TOO_MANY_REQUESTS,
          err.message
        )
      case err instanceof NotImplementedError:
        return sendErrorResponse(res, HTTP_STATUS.NOT_IMPLEMENTED, err.message)
      case err instanceof GatewayTimeoutError:
        return sendErrorResponse(res, HTTP_STATUS.GATEWAY_TIMEOUT, err.message)

      case err instanceof ServiceUnavailableError:
        const message =
          process.env.NODE_ENV === 'production'
            ? 'Service unavailable'
            : String(err.stack)
        return sendErrorResponse(res, HTTP_STATUS.SERVICE_UNAVAILABLE, message)
      default:
        next(err)
    }
  }
}
