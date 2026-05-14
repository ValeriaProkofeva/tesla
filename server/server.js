import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const io = initSocket(server);

app.get('/health', async (req, res) => {
    try {
        res.status(200).send('OK');
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).send('Service Unavailable');
    }
});

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