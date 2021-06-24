import { Sequelize } from 'sequelize';
import { logger } from '../utils';
import { appEnv } from './';

const config = appEnv.config.postgresql;
const errorLog = (error: string) =>
  logger.errorLog(error, logger.label.sequelize, logger.label.postgres);
const infoLog = (info: string) =>
  logger.infoLog(info, logger.label.sequelize, logger.label.postgres);

let sequelize: Sequelize;

const startDb = () => {
  sequelize = new Sequelize(config.db_name, config.user, config.pass, {
    // the sql dialect of the database
    dialect: 'postgres',
    dialectOptions:
      process.env.NODE_ENV === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    // custom host; default: localhost
    host: config.host,
    // custom port; default: dialect default
    port: Number(config.port),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // custom protocol; default: 'tcp'
    // postgres only, useful for Heroku
    //==== protocol: null,
    // disable logging or provide a custom logging function; default: console.log
    logging: (message: string) => infoLog(message),
  });

  sequelize
    .authenticate()
    .then(() => {
      infoLog(
        logger.useChalk(
          `Connection has been established successfully to database : "${config.db_name}".`,
          'success',
        ),
      );
    })
    .catch((error) => {
      errorLog(
        logger.useChalk(`Unable to connect to the database: ${error}`, 'error'),
      );
      process.exit(0);
    });

  return sequelize;
};

const closeDb = async (): Promise<void> => {
  try {
    await sequelize.close();
    infoLog(
      logger.useChalk(
        `Connection has been close to database : "${config.db_name}".`,
        'info',
      ),
    );
  } catch (error) {
    errorLog(
      logger.useChalk(`Unable to connect to the database: ${error}`, 'error'),
    );
  }
};

const dropTables = async (): Promise<void> => {
  try {
    await sequelize.drop();
    infoLog(
      logger.useChalk(
        `tables has been drop to database : "${config.db_name}".`,
        'info',
      ),
    );
  } catch (error) {
    errorLog(
      logger.useChalk(`Unable to connect to the database: ${error}`, 'error'),
    );
  }
};

export { startDb, closeDb, dropTables };
