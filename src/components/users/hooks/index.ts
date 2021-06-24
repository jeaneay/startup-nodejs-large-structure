import { appEnv } from '../../../config';
import bcrypt from 'bcryptjs';
import { CreateOptions } from 'sequelize/types';
import { IUserModel } from '../models/user';

export const cryptPassword = async (
  user: IUserModel,
  options?: CreateOptions<IUserModel>,
) => {
  try {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(appEnv.SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
  } catch (error) {
    return error;
  }
};
