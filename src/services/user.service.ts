import { NotFoundError } from '@/utils/errors'
import { handleErrors } from '@/utils/errors/errors.utils'
import { User } from '@prisma/client'
import InitializerDB from '../config/prisma-Initializer.config'
import AddressService from './address.service'

class UserService {
  private prisma
  private addressService

  constructor() {
    this.prisma = InitializerDB.prisma
    this.addressService = AddressService
  }

  async getUsers(): Promise<User[] | void> {
    try {
      return await this.prisma.user.findMany({
        select: {
          firstName: true,
          lastName: true
        }
      })
    } catch (error) {
      handleErrors(error)
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    try {
      const address = await this.addressService.getAddressByUserId(userId)
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          firstName: true,
          lastName: true
        }
      })

      return user ? { ...user, ...(address && {...address}) } : null
    } catch (error) {
      handleErrors(error)
    }
  }

  async signin({email, password}: {email: string, password: string}): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
          password,
        },
        select: {
          firstName: true,
          lastName: true
        }
      })
      if (!user) {
        throw new NotFoundError('User not found')
      }
      return user
    } catch (error) {
      handleErrors(error)
    }
  }
}

export default new UserService()
