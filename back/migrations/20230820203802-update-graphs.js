'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'graphs',
      'name',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    )
    await queryInterface.addColumn(
      'graphs',
      'data_type',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    )
    await queryInterface.addColumn(
      'graphs',
      'graph_type',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    )
    await queryInterface.addColumn(
      'graphs',
      'graph_size',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    )
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('graphs', 'name'),
    await queryInterface.removeColumn('graphs', 'data_type'),
    await queryInterface.removeColumn('graphs', 'graph_type'),
    await queryInterface.removeColumn('graphs', 'graph_type')  
  }
};

