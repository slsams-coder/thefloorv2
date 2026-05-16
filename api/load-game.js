const { Redis } = require('@upstash/redis');

// Automatically connects using the Environment Variables you added in Vercel
const redis = Redis.fromEnv();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body;

  try {
    const user = await redis.get(`user:${username}`);
    
    if (user && user.password === password) {
      return res.status(200).json({ saves: user.saves || [] });
    }
    
    return res.status(401).json({ error: 'Invalid credentials.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection error' });
  }
};
