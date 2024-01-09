import express from 'express'
import logger from '../config/winston.logger'

interface IErrnoException extends NodeJS.ErrnoException {
  port: number | string
}

const allowOrigins = [process.env.URL_WEBSITE, process.env.OTHER_URL_WEBSITE]
process.env.NODE_ENV !== 'production'
  ? allowOrigins.push('http://localhost:3000')
  : null

// getNormalizePort : Return valid port in string or number
const getNormalizePort = (val: string): string | number | boolean => {
  const port: number = parseInt(val, 10)
  if (Number.isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

// getErrorHandler : Searches for the various errors and manages them appropriately. It is then stored in the server
const getErrorHandler = (error: IErrnoException) => {
  if (error.syscall !== 'listen') {
    logger.error('Server error:', error)
  }

  const bind =
    typeof error.port === 'string' ? 'Pipe ' + error.port : 'Port ' + error.port
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges.`)
      break
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use.`)
      break
    default:
      throw error
  }
}

const getHeaders = (
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization, origin'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,PATCH,POST,DELETE,OPTIONS'
  )
  next()
}

const getCorsOptions = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean | undefined) => void
) => {
  //Accept whitelist and app mobile, server to server, postman...
  if (allowOrigins.includes(origin) || !origin) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'))
  }
}

const setCache = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  //Keep cache for 5 minutes (in seconds)
  const period = 60 * 5 // REPLACE BY CONSTANT TIME_TO_KEEP_CACHE_IN_MINUTES

  //You only want to cache for GET requests
  if (req.method === 'GET') {
    res.set('Cache-control', `public, max-age=${period}`)
  } else {
    // for the other requests set strict no caching parameters
    res.set('Cache-control', `no-store`)
  }

  next()
}

export {
  getCorsOptions,
  getErrorHandler,
  getHeaders,
  getNormalizePort,
  setCache
}
