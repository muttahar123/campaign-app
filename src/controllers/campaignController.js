import CampaignModel from '../models/campaignModel.js';
import { getIO } from '../services/socket.js';

export const getAllCampaigns = async (req, res) => {
  try {
    const { limit, page, status, sort, order } = req.query;
    const offset = page ? (Math.max(1, parseInt(page)) - 1) * (limit || 10) : 0;
    
    // Pass everything to the model
    const campaignsData = await CampaignModel.findAll({ 
      limit: limit || 10, 
      offset, 
      sort, 
      order, 
      status 
    });
    
    res.json(campaignsData);
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

    // Rule Engine: Check if spend exceeds threshold
    const thresholdPercentage = Number(campaign.alert_threshold_percent) || 0.90;
    if (campaign.budget > 0 && Number(campaign.spend) / Number(campaign.budget) >= thresholdPercentage) {
      const io = getIO();
      const message = `Alert: Campaign '${campaign.name}' has exceeded ${(thresholdPercentage * 100).toFixed(0)}% of its budget.`;
      
      // Save alert to DB
      const alert = await CampaignModel.createAlert(campaign.id, message);
      
      // Emit to clients
      io.emit('budget_alert', {
        alertId: alert.id,
        campaignId: campaign.id,
        name: campaign.name,
        spend: Number(campaign.spend),
        budget: Number(campaign.budget),
        message: alert.message
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
