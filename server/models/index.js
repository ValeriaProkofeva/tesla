import sequelize from '../config/database.js';
import User from './User.js';
import Consultation from './Consultation.js';
import ServiceRequest from './ServiceRequest.js';
import EquipmentOrder from './EquipmentOrder.js';
import Product from './Product.js';

// Определяем связи
User.hasMany(Consultation, { 
  foreignKey: 'userId', 
  as: 'consultations',
  onDelete: 'CASCADE',
});
Consultation.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

User.hasMany(ServiceRequest, { 
  foreignKey: 'userId', 
  as: 'serviceRequests',
  onDelete: 'CASCADE',
});
ServiceRequest.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

User.hasMany(EquipmentOrder, { 
  foreignKey: 'userId', 
  as: 'equipmentOrders',
  onDelete: 'CASCADE',
});
EquipmentOrder.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});
Product.hasMany(EquipmentOrder, 
  { foreignKey: 'productId', 
    as: 'orders' 
  });
export {
  sequelize,
  User,
  Consultation,
  ServiceRequest,
  EquipmentOrder,
  Product,
};