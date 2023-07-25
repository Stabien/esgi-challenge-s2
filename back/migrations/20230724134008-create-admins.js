'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'admins',
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
        underscored: true,
      },
    )
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('admins')
  },
}
