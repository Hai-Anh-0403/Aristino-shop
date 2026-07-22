/**
 * Lightweight, zero-dependency sliding window rate limiter middleware for Express.
 * Keeps track of requests using client IP addresses.
 */
const rateLimitCache = new Map();

// Clean up expired entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitCache.entries()) {
    // If the newest timestamp is older than 15 minutes, delete the IP entry
    if (timestamps.length === 0 || now - timestamps[timestamps.length - 1] > 15 * 60 * 1000) {
      rateLimitCache.delete(ip);
    }
  }
}, 10 * 60 * 1000);

const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.' } = {}) => {
  return (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const now = Date.now();

    if (!rateLimitCache.has(ip)) {
      rateLimitCache.set(ip, []);
    }

    const timestamps = rateLimitCache.get(ip);

    // Keep only timestamps within the sliding window
    const recentTimestamps = timestamps.filter(time => now - time < windowMs);

    if (recentTimestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    recentTimestamps.push(now);
    rateLimitCache.set(ip, recentTimestamps);

    next();
  };
};

module.exports = createRateLimiter;
