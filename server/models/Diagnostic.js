import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Diagnostic = sequelize.define('Diagnostic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM('single', 'multiple', 'yesno'),
    defaultValue: 'single',
  },
  options: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'diagnostics',
  timestamps: true,
});

export default Diagnostic;