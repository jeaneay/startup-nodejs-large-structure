import * as dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
import winston from 'winston';
import { getDateNowWinston, ignorePrivate, logFormat } from './winston.config';

const NODE_ENV: string = process.env.NODE_ENV || 'development'

const { combine, colorize, timestamp, errors } = format;

if (NODE_ENV !== 'production') {
  dotenv.config();
}

/* level : error: 0, warn: 1, info: 2, 
http: 3, verbose: 4, debug: 5, silly: 6 */
const options = {
  console: {
    format: format.combine(colorize(), logFormat),
    handleExceptions: true,
    level: 'silly',
  },
  file_all: {
    filename: `app-all-log-${getDateNowWinston()}.log`,
    dirname: `${process.env.PWD}/logs/all/`,
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'silly',
  },
  file_exception: {
    filename: `app-exception-${getDateNowWinston()}.log`,
    dirname: `${process.env.PWD}/logs/exceptions/`,
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    handleExceptions: true,
    level: 'silly',
  },
};

const logDev: winston.Logger = createLogger({
  format: combine(
    ignorePrivate(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'backend' },
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file_all),
  ],
  exceptionHandlers: [options.file_exception],
  exitOnError: false, // do not exit on handled exceptions
});

export default logDev;
