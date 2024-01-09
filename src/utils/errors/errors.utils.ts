import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Response } from 'express'
import logger from '../config/winston.logger'
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError
} from '../helpers/errors'
import Server from '../server'

export const catchAllServerExceptions = (serverInstance: Server) => {
  process.on('uncaughtException', error => {
    logger.error('Uncaught Exception:', error)
    serverInstance.stop(() => {
      process.exit(1)
    })
  })

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
    serverInstance.stop(() => {
      process.exit(1)
    })
  })
}

export const sendErrorResponse = (
  res: Response,
  status: number,
  message: string
) => {
  res.status(status).json({ message })
}

export const handlePrismaError = (error: any) => {
  switch (error.code) {
    case 'P2025':
      logger.error('Resource not found:', error)
      throw new NotFoundError('Resource not found')
    case 'P2002':
      logger.error('Unique constraint failed:', error)
      throw new ConflictError('Unique constraint failed')
    default:
      logger.error(`Unhandled Prisma error: ${error.code}`, error)
      throw new InternalServerError(`Unhandled Prisma error: ${error.code}`)
  }
}

export const handleErrors = (error: any) => {
  if (error instanceof PrismaClientKnownRequestError) {
    handlePrismaError(error)
  }
  if (error instanceof ValidationError) {
    throw new BadRequestError(error.message)
  }
  throw new InternalServerError('An internal server error occurred')
}
