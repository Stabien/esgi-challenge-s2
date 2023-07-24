'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Admins',
      {
        uuid: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        email: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
      },
      {
        timestamps: true,
        underscored: true,
      },
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Admins')
  },
}
