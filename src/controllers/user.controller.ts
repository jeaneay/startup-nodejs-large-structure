import { NotFoundError } from '@/utils/errors'
import schemaValidator from '@/utils/joy.util'
import { NextFunction, Request, Response } from 'express'
import UserService from '../services/user.service'
import UserValidator from '../validators/user.validator'

class UserController {
  private userService

  constructor() {
    this.userService = UserService
  }

  private _userIdValidator(userId: number | string) {
    const value = schemaValidator(UserValidator.userIdSchema, { userId })
    return parseInt(value.userId)
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.value['body']
      const user = await this.userService.signin(body)
      res.json({ user })
    } catch (error) {
      next(error)
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = this._userIdValidator(req.params.userId)
      const user = await this.userService.getUserById(userId)
      if (!user) {
        throw new NotFoundError('User not found')
      }
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
