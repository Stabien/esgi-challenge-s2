'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      societyName: DataTypes.STRING,
      url: DataTypes.STRING,
      kbisUuid: DataTypes.UUID,
      status: DataTypes.ENUM('REJECTED', 'PENDING', 'VALIDATED'),
    },
    {
      sequelize,
      modelName: 'Users',
    },
  )
  return Kbis
}
