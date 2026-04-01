import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';

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

// Unique Request ID Middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Logging Middleware
morgan.token('id', (req) => req.id);
app.use(morgan(':id :method :url :status :res[content-length] - :response-time ms'));

// Global Rate Limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/generate', aiRoutes);

// Health check endpoint with model info
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    version: '1.0.0',
    model: 'gpt-4o',
    service: 'campaign-api'
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Campaign API is running'
  });
});


app.use((err, req, res, next) => {
  console.error(`[${req.id}] Error:`, err.stack);
  res.status(500).json({ error: 'Something broke in the server!' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
