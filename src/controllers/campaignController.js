import CampaignModel from '../models/campaignModel.js';
import { getIO } from '../services/socket.js';

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignModel.findAll();
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await CampaignModel.findById(id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const campaign = await CampaignModel.create(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await CampaignModel.update(id, req.body);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found or deleted' });
    }

    // Rule Engine: Check if spend >= 90% of budget
    if (campaign.budget > 0 && Number(campaign.spend) / Number(campaign.budget) >= 0.9) {
      const io = getIO();
      io.emit('budget_alert', {
        campaignId: campaign.id,
        name: campaign.name,
        spend: Number(campaign.spend),
        budget: Number(campaign.budget),
        message: `Alert: Campaign '${campaign.name}' has exceeded 90% of its budget.`
      });
    }
    
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await CampaignModel.softDelete(id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found or already deleted' });
    }
    
    res.json({ message: 'Campaign soft deleted', campaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
