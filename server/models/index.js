import sequelize from '../config/database.js';
import User from './User.js';
import Consultation from './Consultation.js';
import ServiceRequest from './ServiceRequest.js';
import EquipmentOrder from './EquipmentOrder.js';
import Product from './Product.js';
import ChatRoom from './ChatRoom.js';
import ChatMessage from './ChatMessage.js';

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

  User.hasMany(ChatRoom, { as: 'userRooms', foreignKey: 'userId' });
User.hasMany(ChatRoom, { as: 'managerRooms', foreignKey: 'managerId' });
ChatRoom.belongsTo(User, { as: 'user', foreignKey: 'userId' });
ChatRoom.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });

ChatRoom.hasMany(ChatMessage, { as: 'messages', foreignKey: 'roomId' });
ChatMessage.belongsTo(ChatRoom, { as: 'room', foreignKey: 'roomId' });

User.hasMany(ChatMessage, { as: 'sentMessages', foreignKey: 'senderId' });
User.hasMany(ChatMessage, { as: 'receivedMessages', foreignKey: 'receiverId' });
ChatMessage.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
ChatMessage.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

export {
  sequelize,
  User,
  Consultation,
  ServiceRequest,
  EquipmentOrder,
  Product,
  ChatRoom,
  ChatMessage,
};