import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

interface ConfigPostgresql {
  host: string | undefined;
  port: number | string | boolean;
  db_name: string;
  user: string;
  pass: string;
}

interface ConfigServer {
  ip_address: string;
  port: number | string | boolean;
  postgresql: ConfigPostgresql;
}

const ENV: string = process.env.NODE_ENV || 'development';

const test: ConfigServer = {
  ip_address: '0.0.0.0',
  postgresql: {
    db_name: process.env.TEST_DB_NAME || 'testDB',
    host: process.env.TEST_DB_HOST || 'localhost',
    pass: process.env.TEST_DB_PASS || 'testing',
    port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
    user: process.env.TEST_DB_USER || 'testing',
  },
  port: parseInt(process.env.TEST_APP_PORT || '8091', 10),
};

const local: ConfigServer = {
  ip_address: '0.0.0.0',
  postgresql: {
    db_name: process.env.LOCAL_DB_NAME || 'localDB',
    host: process.env.LOCAL_DB_HOST || 'localhost',
    pass: process.env.LOCAL_DB_PASS || 'testing',
    port: parseInt(process.env.LOCAL_DB_PORT || '5432', 10),
    user: process.env.LOCAL_DB_USER || 'testing',
  },
  port: parseInt(process.env.LOCAL_APP_PORT || '8090', 10),
};

const statging: ConfigServer = {
  ip_address: '0.0.0.0',
  postgresql: {
    db_name: process.env.STAGING_DB_NAME || '',
    host: process.env.STAGING_DB_HOST,
    pass: process.env.STAGING_DB_PASS || '',
    port: parseInt(process.env.STAGING_DB_PORT || '5432', 10),
    user: process.env.STAGING_DB_USER || '',
  },
  port: parseInt(process.env.STAGING_APP_PORT || '8080', 10),
};

const production: ConfigServer = {
  ip_address: '0.0.0.0',
  postgresql: {
    db_name: process.env.PROD_DB_NAME || '',
    host: process.env.PROD_DB_HOST,
    pass: process.env.PROD_DB_PASSWORD || '',
    port: parseInt(process.env.PROD_DB_PORT || '5432', 10),
    user: process.env.PROD_DB_USERNAME || '',
  },
  port: parseInt(process.env.PORT || '8080', 10),
};

const settings: any = { test, local, statging, production };
export const config: ConfigServer = settings.hasOwnProperty(ENV)
  ? settings[ENV]
  : settings.local;
export const JWT_SECRET: string = process.env.JWT_SECRET || 'JWT_SECRET';
export const JWT_EXPIRESIN: number = Number(process.env.JWT_EXPIRESIN) || 1800;
export const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET';
export const JWT_REFRESH_EXPIRESIN: number =
  Number(process.env.JWT_REFRESH_EXPIRESIN) || 259200; //259200 = 3d
export const JWT_RESET_PASSWORD_SECRET: string =
  process.env.JWT_RESET_PASSWORD_SECRET || 'JWT_SECRET';
export const JWT_RESET_PASSWORD_EXPIRESIN: number =
  Number(process.env.JWT_RESET_PASSWORD_EXPIRESIN) || 1800; //1800 = 30m
export const SALT_WORK_FACTOR: number = parseInt(
  process.env.SALT_PASSWORD || '10',
  10,
);
