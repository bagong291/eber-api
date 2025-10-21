const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Article extends Model {}
Article.init({
  // Multi-language support for title and body
  title_en: { type: DataTypes.STRING, allowNull: false },
  title_id: { type: DataTypes.STRING, allowNull: false },
  body_en:  { type: DataTypes.TEXT,   allowNull: false },
  body_id:  { type: DataTypes.TEXT,   allowNull: false },
  
  // Legacy fields (keep for backward compatibility, will be deprecated)
  title: { type: DataTypes.STRING, allowNull: true },
  body:  { type: DataTypes.TEXT,   allowNull: true },
  
  group: { type: DataTypes.STRING, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true },
  pdf:   { type: DataTypes.STRING, allowNull: true },
  author:{ type: DataTypes.STRING },
  status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Article',
  tableName: 'articles',
  timestamps: true
});

module.exports = Article;
