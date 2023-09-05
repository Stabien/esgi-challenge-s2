'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alerts', {
      uuid: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      app_id: {
        type: Sequelize.STRING,
      },
      // user_uuid: {
      //   type: Sequelize.DataTypes.UUID,
      // },
      graph_uuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      uri: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      time_before_new_alert: {
        type: Sequelize.STRING,
      },
      // event: {
      //   type: Sequelize.STRING,
      // },

      // data_type: {
      //   type: Sequelize.STRING,
      // },
      // time_scale: {
      //   type: Sequelize.STRING,
      // },
      // value_to_trigger: {
      //   type: Sequelize.STRING,
      // },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alerts')
  },
}
