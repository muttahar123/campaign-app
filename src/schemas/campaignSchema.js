import { z } from 'zod';

export const campaignSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  client: z.string().min(1, 'Client is required').max(255),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
  budget: z.number().min(0).optional(),
  spend: z.number().min(0).optional(),
  impressions: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
  conversions: z.number().int().min(0).optional()
});

export const updateCampaignSchema = z.object({
  name: z.string().max(255).optional(),
  client: z.string().max(255).optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
  budget: z.number().min(0).optional(),
  spend: z.number().min(0).optional(),
  impressions: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
  conversions: z.number().int().min(0).optional()
});

export const validateCampaign = (req, res, next) => {
  try {
    campaignSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors.map(e => ({ path: e.path[0] || 'body', message: e.message })) });
    }
    next(error);
  }
};

export const validateUpdateCampaign = (req, res, next) => {
  try {
    updateCampaignSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors.map(e => ({ path: e.path[0] || 'body', message: e.message })) });
    }
    next(error);
  }
};
