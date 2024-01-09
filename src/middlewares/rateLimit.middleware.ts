import rateLimit from 'express-rate-limit'

const nodeDevEnv = process.env.NODE_ENV === 'development'

const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes must seconds
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: 'Too much general request.',
  standardHeaders: nodeDevEnv ? true : 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: nodeDevEnv ? true : false // Disable the `X-RateLimit-*` headers.
})

export { generalRateLimiter }
