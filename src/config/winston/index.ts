import winston from 'winston';
import logDev from './winston.dev.config';
import logProd from './winston.prod.config';

const env: string = process.env.NODE_ENV || 'development';

// If production we use logger for production else development
let logger: winston.Logger = env === 'production' ? logProd : logDev;

// LogerStream allow to save the log from Morgan middleware with winston
// Tuto : https://gist.github.com/cklanac/97dda6a49fdd5ce1711c5cc3299ded50
// We use class because of typescript error : https://stackoverflow.com/questions/27906551/node-js-logging-use-morgan-and-winston/28824464#28824464
export class LoggerStream {
  write(message: string) {
    logger.info(message.substring(0, message.lastIndexOf('\n')))
  }
}

export default logger;
