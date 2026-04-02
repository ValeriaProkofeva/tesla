import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.STRING(50),  // Изменено с ENUM на STRING
    allowNull: false,
  },
  serviceName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),  // Изменено с ENUM на STRING
    defaultValue: 'new',
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'service_requests',
  timestamps: true,
});

export default ServiceRequest;