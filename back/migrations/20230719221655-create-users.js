'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Users',
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
        societyName: {
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
        kbisUuid: {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        underscored: true,
      },
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  },
}
