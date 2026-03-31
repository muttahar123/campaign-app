import express from 'express';
import {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateCampaign, validateUpdateCampaign } from '../schemas/campaignSchema.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', validateCampaign, createCampaign);
router.put('/:id', validateUpdateCampaign, updateCampaign);
router.delete('/:id', deleteCampaign);

export default router;
