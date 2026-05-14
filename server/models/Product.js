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

  powerMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Минимальная мощность в кВА',
  },
  powerMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Максимальная мощность в кВА',
  },
  
  voltageHV: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Напряжение ВН: 0.4, 6, 10, 20, 35 кВ',
  },
  
  voltageLV: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Напряжение НН: 0.23, 0.4, 0.69, 6, 10 кВ',
  },
  
  insulationType: {
    type: DataTypes.ENUM('oil', 'dry', 'hermetic'),
    allowNull: true,
    comment: 'Тип изоляции: масляный, сухой, герметичный',
  },
  
  installationType: {
    type: DataTypes.ENUM('outdoor', 'indoor'),
    allowNull: true,
    comment: 'Тип установки: наружная, внутренняя',
  },
  
  efficiencyClass: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Класс энергоэффективности: Х2К2, Х3К2',
  },
  
  industry: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Сфера применения: энергетика, промышленность, нефтегаз, ЖД, строительство',
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