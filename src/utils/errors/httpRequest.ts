interface Error {
  message: string;
}

export class RequestError extends Error {
  private _data: Object;
  private _statusCode: number;
  constructor(error: Error, statusCode: number) {
    super(error.message);
    this._data = { error };
    this._statusCode = statusCode ? statusCode : 400;
  }
}

export class BadRequestError extends Error {
  private _data: Object;
  private _statusCode: number;
  constructor(error: Error) {
    super(error.message);
    this._data = { error };
    this._statusCode = 400;
  }
}

export class ForbiddenRequestError extends Error {
  private _data: Object;
  private _statusCode: number;
  constructor(error: Error) {
    super(error.message);

    this._data = { error };
    this._statusCode = 403;
  }
}

export class NotFoundRequestError extends Error {
  private _data: Object;
  private _statusCode: number;
  constructor(error: Error) {
    super(error.message);

    this._data = { error };
    this._statusCode = 404;
  }
}

export class ConflictRequestError extends Error {
  private _data: Object;
  private _statusCode: number;
  constructor(error: Error) {
    super(error.message);

    this._data = { error };
    this._statusCode = 409;
  }
}
