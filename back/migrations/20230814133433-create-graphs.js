'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('graphs', {
      uuid: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      user_uuid: {
        type: Sequelize.DataTypes.UUID,
      },
      event: {
        type: Sequelize.STRING
      },
      time_scale: {
        type: Sequelize.STRING
      },
      tag_uuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('graphs');
  }
};