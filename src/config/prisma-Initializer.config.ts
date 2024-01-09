import { PrismaClient } from '@prisma/client'
import { NUMBER_OF_DATABASE_CONNECTION_ATTEMPTS } from '../constants/commons'
import logger from './winston.logger'

//Signleton class to initialize the database connection
class InitializerDB {
  private static prismaInstance: PrismaClient | null = null

  static get prisma(): PrismaClient {
    if (!InitializerDB.prismaInstance) {
      InitializerDB.prismaInstance = new PrismaClient()
      InitializerDB._initialize()
    }
    return InitializerDB.prismaInstance
  }

  private static async _initialize(
    attempts = NUMBER_OF_DATABASE_CONNECTION_ATTEMPTS
  ) {
    while (attempts > 0) {
      try {
        await InitializerDB.prismaInstance?.$connect()
        logger.info('Database connection successful.')
        return
      } catch (error) {
        logger.error(
          `Connection attempt failed, ${attempts - 1} attempts left...`,
          error
        )
        attempts--
        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds before trying again
      }
    }
    logger.error('All attempts to connect to the database have failed.')
    process.exit(1)
  }

  static async closeDatabaseConnection() {
    if (InitializerDB.prismaInstance) {
      await InitializerDB.prismaInstance.$disconnect()
      logger.info('Database connection closed.')
    }
  }
}

export default InitializerDB
