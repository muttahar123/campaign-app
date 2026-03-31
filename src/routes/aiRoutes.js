import express from 'express';
import { generateCopy, generateSocial, generateHashtags } from '../controllers/aiController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.post('/copy', generateCopy);
router.post('/social', generateSocial);
router.post('/hashtags', generateHashtags);

export default router;
