import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '/images/products/default.jpg',
  },
  shortDescription: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  specifications: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('specifications');
      return raw ? JSON.parse(raw) : [];
    },
    set(value) {
      this.setDataValue('specifications', JSON.stringify(value));
    },
  },
  price: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

export default Product;