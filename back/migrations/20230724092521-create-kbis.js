'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'kbis',
      {
        uuid: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        path: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.DataTypes.NOW
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.DataTypes.NOW
        },
        user_uuid: {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          allowNull: false,
        }
      },
      {
        underscored: true,
        timestamps: true
      },
    )
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('kbis')
  },
}
