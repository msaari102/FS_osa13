const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

const d = new Date();
let year = parseInt(d.getFullYear());

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title : {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes : {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1991,
      max: year,
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog