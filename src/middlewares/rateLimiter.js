import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again after a minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiLimiter;
