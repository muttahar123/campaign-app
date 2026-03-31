import express from 'express';
import { generateCopy } from '../controllers/aiController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.post('/copy', generateCopy);

export default router;
