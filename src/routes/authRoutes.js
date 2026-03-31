import express from 'express';
import { register, login } from '../controllers/authController.js';
import apiLimiter from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);

export default router;
