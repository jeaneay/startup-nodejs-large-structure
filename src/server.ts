import * as http from 'http'
import App from './app'
import InitializerDB from './config/prisma-Initializer.config'
import logger from './config/winston.logger'
import { getErrorHandler } from './helpers/server.helpers'

class Server extends App {
  private _port: number
  private _httpServer: http.Server

  constructor(port: number) {
    super()
    this._port = port
    this._httpServer = http.createServer(this.app)
  }

  private _getServerError(): void {
    this._httpServer.on('error', getErrorHandler)
  }

  private _listenServer(): void {
    this._getServerError()
    this._httpServer.listen(this._port, (): void => {
      logger.info(`App starting on the http://127.0.0.1:${this._port}`)
    })
  }

  public start() {
    this._listenServer()
  }

  public restart() {
    this.stop(() => {
      logger.info('Server restarting...')
      this.start()
    })
  }

  public async stop(callback?: () => void) {
    // Close database connection
    await InitializerDB.closeDatabaseConnection()
    // Close HTTP server
    this._httpServer.close(() => {
      logger.info('Server closed.')
      if (callback) callback()
    })
  }
}

export default Server
