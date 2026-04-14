import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Work = sequelize.define('Work', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '/images/works/default.jpg',
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  year: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  client: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  results: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'works',
  timestamps: true,
});

export default Work;