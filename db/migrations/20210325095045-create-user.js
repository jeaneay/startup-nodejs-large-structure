'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        confirmEmailUuid: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        attemptConfirmEmail: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        isEmailVerified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        tokenResetPassword: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        language: {
          type: Sequelize.ENUM("fr", "en"),
          allowNull: false,
          defaultValue: "fr"
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        avatar: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        job: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        birthday: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        lastLogin: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("member", "freelance", "company", "association", "staff"),
          allowNull: false,
        },
        gender: {
          type: Sequelize.ENUM("male", "female"),
          allowNull: true,
        },
        companyId: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'Companies',
              key: 'id'
            },
          },
          allowNull: true,
          onDelete: "set null",
          onUpdate: "cascade"
        },
        companyFounderId: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'Companies',
              key: 'id'
            },
          },
          allowNull: true,
          onDelete: "set null",
          onUpdate: "cascade"
        },
        facebookUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        twitterUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        linkedinUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        instagramUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        websiteUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      }, 
      { transaction });

      await queryInterface.addIndex(
        'Users',
        ['companyId'],
        {
          transaction,
        }
      );

      await queryInterface.addIndex(
        'Users',
        ['email'],
        {
          unique: true,
          indicesType:"UNIQUE",
          transaction,
        }
      );

      await queryInterface.addIndex(
        'Users',
        ['status'],
        {
          indicesType:"FULLTEXT",
          transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('Users', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_status";', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_language";', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_gender";', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};