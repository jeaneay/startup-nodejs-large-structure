import { HTTP_STATUS } from '../../constants/commons'
import { HTTP_MESSAGE } from '../../constants/messages'

export class CustomError extends Error {
  public status: number
  public isOperational: boolean

  constructor(message: string, status: number, isOperational: boolean = true) {
    // The addition of Object.setPrototypeOf and Error.captureStackTrace improves error debugging capability, ensuring that the call stack is clean and that prototype chaining is correct. This can be particularly useful when logging errors or sending them to error monitoring services.
    super(message)
    Object.setPrototypeOf(this, new.target.prototype) // Restore the prototype chain
    this.status = status
    this.isOperational = isOperational
    Error.captureStackTrace(this) // For a clean stack trace
  }
}

export class BadRequestError extends CustomError {
  constructor(message?: string) {
    super(message || HTTP_MESSAGE.BAD, HTTP_STATUS.BAD, true)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class UnprocessableEntityError extends CustomError {
  constructor(message?: string) {
    super(
      message || HTTP_MESSAGE.UNPROCESSABLE_ENTITY,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      true
    )
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string) {
    super(message, HTTP_STATUS.INTERNAL_SERVER, false)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends CustomError {
  constructor(message?: string) {
    super(message || HTTP_MESSAGE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, true)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class InternalServerError extends CustomError {
  constructor(message?: string) {
    super(
      message || HTTP_MESSAGE.INTERNAL_SERVER,
      HTTP_STATUS.INTERNAL_SERVER,
      false
    )
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message?: string) {
    super(
      message || HTTP_MESSAGE.SERVICE_UNAVAILABLE,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      true
    )
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD, true)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message?: string) {
    super(message || HTTP_MESSAGE.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, true)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ForbiddenError extends CustomError {
  constructor(message?: string) {
    super(message || HTTP_MESSAGE.FORBIDDEN, HTTP_STATUS.FORBIDDEN, true)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ConflictError extends CustomError {
  constructor(message?: string) {
    super(message || HTTP_MESSAGE.CONFLICT, HTTP_STATUS.CONFLICT, true)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class TooManyRequestsError extends CustomError {
  constructor(message?: string) {
    super(
      message || HTTP_MESSAGE.TOO_MANY_REQUESTS,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      true
    )
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotImplementedError extends CustomError {
  constructor(message?: string) {
    super(
      message || HTTP_MESSAGE.NOT_IMPLEMENTED,
      HTTP_STATUS.NOT_IMPLEMENTED,
      false
    )
    Error.captureStackTrace(this, this.constructor)
  }
}

export class GatewayTimeoutError extends CustomError {
  constructor(message?: string) {
    super(
      message || HTTP_MESSAGE.GATEWAY_TIMEOUT,
      HTTP_STATUS.GATEWAY_TIMEOUT,
      false
    )
    Error.captureStackTrace(this, this.constructor)
  }
}
