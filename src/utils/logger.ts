import { ILabel } from '../config/winston/types';
import { winston } from '../config';
import chalk from 'chalk';

// LabelLog : Allow to determine which section from log
const label: ILabel = {
  user: 'user',
  node: 'node',
  express: 'express',
  sequelize: 'sequelize',
  postgres: 'postgres',
  helpers: 'helpers',
  email: 'email',
  sendinblue: 'sendinblue',
};

const useChalk = (
  error: string,
  typeError: 'success' | 'error' | 'info',
): string => {
  if (process.env.NODE_ENV === 'production') {
    return error;
  } else {
    switch (typeError) {
      case 'success':
        return chalk.green(error);
      case 'error':
        return chalk.red(error);
      default:
        return chalk.yellow(error);
    }
  }
};

const errorLog = (
  error: string,
  labelOne?: String,
  labelTwo?: String,
): void | string => {
  if (process.env.NODE_ENV === 'production') {
    return winston.messageLog({
      label: `${labelOne},${labelTwo}`,
      level: 'error',
      message: error,
    });
  } else {
    console.info(error);
    return error;
  }
};

const infoLog = (info: string, labelOne?: String, labelTwo?: String): void  | string => {
  if (process.env.NODE_ENV === 'production') {
    winston.messageLog({
      label: `${labelOne},${labelTwo}`,
      level: 'info',
      message: info,
    });
  } else {
    console.info(info);
    return info;
  }
};

export { label, errorLog, infoLog, useChalk };
