
import { format } from 'winston';

export const logFormat = format.printf(
    ({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`
    }
  )

// Ignore log messages if the have { private: true }
export const ignorePrivate = format((info, opts) => {
    if (info.private) {
      return false;
    }
    return info;
  });

export const getDateNowWinston = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

