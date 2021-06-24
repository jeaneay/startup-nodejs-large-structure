import * as http from 'http';
import { ErrnoException } from 'node/server';
import { appEnv } from '../config';
import { logger } from './';

const allowOrigins = [process.env.URL_WEBSITE, process.env.OTHER_URL_WEBSITE];
process.env.NODE_ENV !== 'production'
  ? allowOrigins.push('http://localhost:3000')
  : null;

// getNormalizePort : Return valid port in string or number
const getNormalizePort = (val: string): string | number | boolean => {
  const port: number = parseInt(val, 10);
  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// getErrorHandler : Searches for the various errors and manages them appropriately. It is then stored in the server
const getErrorHandler = (error: ErrnoException, server: http.Server) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  //const address = server.address();
  // const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + appEnv.config.port;
  const bind = 'Port: ' + appEnv.config.port;
  switch (error.code) {
    case 'EACCES':
      logger.errorLog(bind + ' requires elevated privileges.', logger.label.node, logger.label.express);
      process.exit(1);
    case 'EADDRINUSE':
      logger.errorLog(bind + ' is already in use.', logger.label.node, logger.label.express);
      process.exit(1);
    default:
      throw error;
  }
};

const getCorsOptions = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean | undefined) => void,
) => {
  //Accept whitelist and app mobile, server to server, postman...
  if (allowOrigins.includes(origin) || !origin) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

export { getNormalizePort, getErrorHandler, getCorsOptions };
