import { DataTypes, Model, Sequelize } from 'sequelize';
import { appMessage } from '../../../utils';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cryptPassword } from '../hooks';

import _ from 'lodash';

export interface IUserAttributes {
  id: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  confirmEmailUuid: string | null;
  isEmailVerified: boolean;
  password: string;
  tokenResetPassword: string;
}
export interface IUserModel extends Model<IUserAttributes>, IUserAttributes {}

module.exports = (sequelize: Sequelize) => {
  class User extends Model<IUserAttributes> implements IUserAttributes {
    public readonly id!: number; // Note that the `null assertion``!` is required in strict mode.
    public firstName!: string | null;
    public lastName!: string | null;
    public fullName!: string | null;
    public email!: string;
    public confirmEmailUuid!: string | null;
    public isEmailVerified!: boolean;
    public password!: string;
    public tokenResetPassword!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public comparePassword = async (
      password: string,
    ): Promise<boolean | void> => {
      try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
      } catch (error) {
        return error;
      }
    };

    static associate(db: any) {
      this.hasOne(db.Token, {
        foreignKey: { name: 'userId', allowNull: false },
        onDelete: 'CASCADE',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: new DataTypes.STRING(255),
        allowNull: true,
        set(value: string) {
          this.setDataValue('firstName', value.toLowerCase()?.trim());
        },
        get() {
          const value = this.getDataValue('firstName');
          return value ? _.capitalize(value) : null;
        },
        validate: {
          is: {
            args: /^[a-zA-ZÀ-ú\s\-]+$/i,
            msg: appMessage.sequelize.ERROR_PROPERTY_NOT_VALID('firstName'),
          },
        },
      },
      lastName: {
        type: new DataTypes.STRING(255),
        allowNull: true,
        set(value: string) {
          this.setDataValue('lastName', value.toLowerCase()?.trim());
        },
        get() {
          const value = this.getDataValue('lastName');
          return value ? _.capitalize(value) : null;
        },
        validate: {
          is: {
            args: /^[a-zA-ZÀ-ú\s\-\']+$/i,
            msg: appMessage.sequelize.ERROR_PROPERTY_NOT_VALID('lastName'),
          },
        },
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        set(value: string) {
          this.setDataValue('email', value.toLowerCase()?.trim());
        },
        validate: {
          notEmpty: {
            msg: appMessage.general.ERROR_VALUE_EMPTY('email'),
          },
          isEmail: {
            msg: appMessage.sequelize.ERROR_PROPERTY_NOT_VALID('email'),
          },
          isUnique: async function (email: string) {
            if (email === this.email) {
              return true;
            }
            const results = await User.findOne({
              where: { email },
            });
            if (results) {
              throw new Error(
                appMessage.sequelize.ERROR_PROPERTY_ALREADY_EXITS(
                  'email',
                  email,
                ),
              );
            }
          },
        },
      },
      confirmEmailUuid: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: uuidv4(),
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: appMessage.general.ERROR_VALUE_EMPTY('password'),
          },
          isLongEnough(password: string) {
            if (password && password.length < 6) {
              throw new Error(appMessage.user.ERROR_PASSWORD);
            }
          },
        },
      },
      tokenResetPassword: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      scopes: {
        findByLogin(email: string) {
          return {
            where: { email },
            attributes: [
              'id',
              'email',
              'password',
              'isEmailVerified',
            ],
          };
        },
      },
      sequelize,
      tableName: 'Users',
    },
  );

  // Hook method !
  User.addHook('beforeCreate', cryptPassword);
  User.addHook('beforeUpdate', cryptPassword);

  return User;
};
