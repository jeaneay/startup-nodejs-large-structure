import { logger } from '..';

const errorLog = (error: string) => logger.errorLog(error, logger.label.node);

/*
 Catching unresolved and rejected promises
 it’s highly recommended using a graceful fallback and subscribe to process.on(‘unhandledRejection’, callback) – this will ensure that any promise error, if not handled locally, will get its treatment.
*/
process.on('unhandledRejection', (reason, p) => {
  // I just caught an unhandled promise rejection, since we already have fallback handler for unhandled errors (see below), let throw and let him handle that
  throw reason;
});

process.on('uncaughtException', (error: Error): void => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  errorLog(error.toString());
  process.exit(1);
});
