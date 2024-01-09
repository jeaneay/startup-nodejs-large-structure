import { handleErrors } from '@/utils/errors/errors.utils'
import InitializerDB from '../config/prisma-Initializer.config'
import { Address } from '@prisma/client'

class AddressService {
  private prisma

  constructor() {
    this.prisma = InitializerDB.prisma
  }

  async getAddressByUserId(userId: number): Promise<Address | null> {
    try {
      return await this.prisma.adress.findMany({
        where: {
          userId
        }
      })
    } catch (error) {
      handleErrors(error)
      return null
    }
  }
}

export default new AddressService()
