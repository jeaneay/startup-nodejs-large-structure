import { DataTypes, Model, Sequelize } from 'sequelize';
import { logger } from '../../../utils';

export interface IToken {
  id?: number;
  userId: number;
  refreshToken: string;
}
export interface ITokenModel extends Model<IToken>, IToken {}

module.exports = (sequelize: Sequelize) => {
  class Token extends Model<IToken> implements IToken {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public userId!: number;
    public refreshToken!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public createTokenByUser = async (
      userId: number,
      refreshToken: string,
    ): Promise<Token | [number, Token[]] | void> => {
      try {
        const token = await Token.findOne({ where: { userId } });
        return token
          ? await Token.update({ refreshToken }, { where: { userId } })
          : await Token.create({ userId, refreshToken });
      } catch (error) {
        logger.errorLog(error);
      }
    };

    static associate({ User }: any) {
      this.belongsTo(User, {
        foreignKey: { name: 'userId', allowNull: false },
        onDelete: 'CASCADE',
      });
    }
  }

  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Tokens',
    },
  );

  return Token;
};
