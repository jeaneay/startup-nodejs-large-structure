import { createLogger, format, transports } from 'winston';
import winston from 'winston';

const { combine, json, timestamp } = format;
const MAX_FILES: number = 10;
const MAX_SIZE: number = 5242880;

// Ignore log messages if the have { private: true }
const ignorePrivate = format((info, opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

/* level : error: 0, warn: 1, info: 2, 
http: 3, verbose: 4, debug: 5, silly: 6  */

const options = {
  file_error: {
    filename: `${process.env.PROD_FILENAME_ERROR_LOG}`,
    level: 'error',
    maxFiles: MAX_FILES,
    maxsize: MAX_SIZE,
  },
  file_http: {
    filename: `${process.env.PROD_FILENAME_HTTP_LOG}`,
    level: 'http',
    maxFiles: MAX_FILES,
    maxsize: MAX_SIZE,
  },
  file_other: {
    filename: `${process.env.PROD_FILENAME_OTHER_LOG}`,
    level: 'info',
    maxFiles: MAX_FILES,
    maxsize: MAX_SIZE,
  },
  file_exception: {
    filename: `${process.env.PROD_FILENAME_EXCEPTION_LOG}`,
    handleExceptions: true,
    level: 'silly',
    maxFiles: MAX_FILES,
    maxsize: MAX_SIZE,
  },
};

const logProd: winston.Logger = createLogger({
  format: combine(
    ignorePrivate(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json(),
  ),
  transports: [
    new transports.File(options.file_error),
    new transports.File(options.file_http),
    new transports.File(options.file_other),
  ],
  exceptionHandlers: [new transports.File(options.file_exception)],
  exitOnError: false, // do not exit on handled exceptions
});

export default logProd;
