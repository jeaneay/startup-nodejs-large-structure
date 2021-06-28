import * as dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, colorize, json, timestamp, simple } = format;

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Ignore log messages if the have { private: true }
const ignorePrivate = format((info, opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

/* level : error: 0, warn: 1, info: 2, 
http: 3, verbose: 4, debug: 5, silly: 6 */

const options = {
  console: {
    format: format.combine(colorize(), simple()),
    handleExceptions: true,
    level: 'silly',
  },
  file_all: new DailyRotateFile({
    filename: 'app-all-log-%DATE%.log',
    dirname: `${process.env.PWD}/logs/all/`,
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'silly',
  }),
  file_exception: new DailyRotateFile({
    filename: 'app-exception-%DATE%.log',
    dirname: `${process.env.PWD}/logs/exceptions/`,
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    handleExceptions: true,
    level: 'silly',
  }),
};

const logDev: winston.Logger = createLogger({
  format: combine(
    ignorePrivate(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json(),
  ),
  transports: [
    new transports.Console(options.console),
    options.file_all,
  ],
  exceptionHandlers: [options.file_exception],
  exitOnError: false, // do not exit on handled exceptions
});

export default logDev;
