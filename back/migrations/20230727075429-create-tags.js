'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'tags',
      {
        uuid: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        user_uuid: {
          type: Sequelize.DataTypes.UUID,
        },
      },
      {
        underscored: true,
      },
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tags')
  },
}
