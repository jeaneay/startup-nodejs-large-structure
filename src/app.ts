import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import methodOverride from 'method-override'
import morgan from 'morgan'
import path from 'path'
import { LoggerStream } from './config/winston.logger'
import { server } from './helpers'
import { NotFoundError } from './helpers/errors'
import { getHeaders, setCache } from './helpers/server.helpers'
import { ErrorHandlingMiddleware } from './middlewares/errorHandler.middleware'
import { generalRateLimiter } from './middlewares/rateLimit.middleware'
import { hotelRoutes } from './routes'

class App {
  public readonly app: express.Application

  public constructor() {
    this.app = express()
    this._getConfig()
    this._getConfigAssets()
    this._getRoutes()
    this._getConfigError()
  }

  private _getConfig(): void {
    // mount compress all response
    this.app.use(compression())
    // mount json from parser
    this.app.use(express.json({ limit: '50mb' }))
    // mount query string parser
    this.app.use(express.urlencoded({ extended: true }))
    // mount methodOverride for override http request with Put and Delete
    this.app.use(methodOverride())
    // get Headers
    this.app.use(getHeaders)
    // Cookie
    this.app.use(cookieParser())
    // morgan : HTTP request logger
    this.app.use(morgan('combined', { stream: new LoggerStream() }))
    // Manage the static files
    this.app.use('/public', express.static(path.join(__dirname, '../public')))
    // mount cors
    this.app.use(
      cors({
        origin: server.getCorsOptions,
        credentials: true
      })
    )
    // mount helmet for secure HTTP headers
    this.app.use(helmet())
    // manage cache
    this.app.use(setCache)
    // rate Limit
    // Apply the rate limiting middleware to all requests.
    // I have to put this middleware before the all route
    this.app.use(generalRateLimiter)
  }

  private _getRoutes(): void {
    //For elasticbeanstalk health
    this.app.get('/', function (req, res) {
      res.writeHead(200, 'Content-type: text/html')
      res.end()
    })

    this.app.use('/api/v1', hotelRoutes)

    //404 errors for routes not found
    this.app.use((req, res, next) => {
      const err = new NotFoundError('Route not found')
      next(err)
    })
  }

  private _getConfigAssets(): void {
    this.app.use(express.static('public'))
  }

  private _getConfigError(): void {
    this.app.use(ErrorHandlingMiddleware.handleErrors)
  }
}

export default App
