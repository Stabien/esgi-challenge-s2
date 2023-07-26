'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'users',
      {
        uuid: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        email: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        firstname: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        society_name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.DataTypes.ENUM('REJECTED', 'PENDING', 'VALIDATED'),
          allowNull: false,
        },
        kbis_uuid: {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          allowNull: false,
        },
        app_id: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        }
      },
      {
        underscored: true,
      },
    )
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  },
}
