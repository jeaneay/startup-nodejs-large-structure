import App from './app';
import * as http from 'http';
import { server } from './utils';

class Server extends App {
  private readonly _port: number;
  private _httpServer: http.Server;

  constructor(port: number) {
    super();
    this._port = port;
    this._httpServer = http.createServer(this.app);
  }

  public start() {
    this._listenServer();
  }

  public stop() {
    this._httpServer.close(function () {
      console.log('Server closed!');
    });
  }

  private _getServerError(): void {
    this._httpServer.on('error', server.getErrorHandler);
  }

  private _listenServer(): void {
    this._getServerError();
    this._httpServer.listen(this._port, (): void => {
      console.log(`App starting on the http://127.0.0.1:${this._port}`);
    });
  }
}

export default Server;
