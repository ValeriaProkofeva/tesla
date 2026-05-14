import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import consultationRoutes from './routes/consultation.js';
import serviceRequestRoutes from './routes/serviceRequests.js';
import equipmentOrderRoutes from './routes/equipmentOrders.js';
import productRoutes from './routes/products.js';
import adminUserRoutes from './routes/adminUsers.js';
import chatRoutes from './routes/chat.js';
import { createAdminIfNotExists } from './controllers/authController.js';
import { seedProducts } from './seeders/seedProducts.js';
import { initSocket } from './socket/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/products', productRoutes);
app.use('/api/equipment-orders', equipmentOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/chats', chatRoutes);

const io = initSocket(server);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    await sequelize.sync();
    console.log('Database synchronized');
    
    await createAdminIfNotExists();
    await seedProducts();
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
      console.log(`WebSocket server ready`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();