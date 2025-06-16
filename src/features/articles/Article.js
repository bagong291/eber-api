const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Article extends Model {}
Article.init({
  title: { type: DataTypes.STRING, allowNull: false },
  body:  { type: DataTypes.TEXT,   allowNull: false },
  author:{ type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Article',
  tableName: 'articles',
  timestamps: true
});

module.exports = Article;
