'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book_post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  book_post.init({
    user_id: DataTypes.INTEGER,
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    cover_url: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    blurb: DataTypes.STRING,
    api_endpoint: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book_post',
  });
  return book_post;
};