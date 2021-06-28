import path from 'path';
import compression from 'compression';
import cors from 'cors';
import errorhandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { routes } from './modules';
import { winston } from './config';
import { server } from './utils';

class App {
  public readonly app: express.Application;

  public constructor() {
    this.app = express();
    this._getConfig();
    this._getConfigAssets();
    this._getRoutes();
    this._getConfigError();
  }

  private _getConfig(): void {
    // mount compress all response
    this.app.use(compression());
    // mount json from parser
    this.app.use(express.json({ limit: '50mb' }));
    // mount query string parser
    this.app.use(express.urlencoded({ extended: true }));
    // mount methodOverride for override http request with Put and Delete
    this.app.use(methodOverride());
    this.app.use(
      (
        _: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ): void => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
          'Access-Control-Allow-Headers',
          'X-Requested-With, Content-Type, Authorization, origin',
        );
        res.header(
          'Access-Control-Allow-Methods',
          'GET,PUT,PATCH,POST,DELETE,OPTIONS',
        );
        next();
      },
    );
    // Cookie
    this.app.use(cookieParser());
    // morgan : HTTP request logger
    this.app.use(morgan('combined', { stream: new winston.LoggerStream() }));
    // Managa the static files
    this.app.use('/public', express.static(path.join(__dirname, '../public')));
    // mount cors
    this.app.use(
      cors({
        origin: server.getCorsOptions,
        credentials: true,
      }),
    );
    // mount helmet for secure HTTP headers
    this.app.use(helmet());
  }

  private _getRoutes(): void {
    //For elasticbeanstalk health
    this.app.get('/', function (req, resp) {
      resp.writeHead(200, 'Content-type: text/html');
      resp.end();
    });

    this.app.get('/favicon.ico', (req, res) => res.status(204));

    this.app.use('/api', routes);

    //All routes that are not matched by our API are redirect
    this.app.get(
      '*',
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        const err = {
          error: new Error(`${req.ip} tried to access ${req.originalUrl}`),
          _statusCode: 301,
        };
        next(err);
      },
    );

    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        //For most errors that don't deal with errors
        if (!err._statusCode) err._statusCode = 500;
        if (err._statusCode === 301) {
          return res.status(301).redirect('/');
        }
        //When is a message from a sequelize bulk the error it's not the same
        let message: string;
        message = err.toString() !== 'Error' ? err.toString() : err._data;
        //Manage error from multer upload
        message = err.field ? err.field : message;
        return res.status(err._statusCode).json({ error: message });
      },
    );
  }

  private _getConfigAssets(): void {
    this.app.use(express.static('public'));
  }

  private _getConfigError(): void {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(errorhandler());
    }
  }
}

export default App;
