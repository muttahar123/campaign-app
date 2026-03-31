import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiLimiter from './middlewares/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { initSocket } from './services/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

app.use(cors());
app.use(express.json());

app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/generate', aiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke in the server!' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
