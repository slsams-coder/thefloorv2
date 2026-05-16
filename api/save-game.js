const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password, action, saveName, gameData } = req.body;

  try {
    const userKey = `user:${username}`;
    let user = await redis.get(userKey);

    // Create Account
    if (action === 'create') {
      if (user) return res.status(400).json({ error: 'Username taken!' });
      
      await redis.set(userKey, { password: password, saves: [] });
      return res.status(200).json({ message: 'Account created!' });
    }
    
    // Save Game
    if (action === 'save') {
      if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials.' });
      
      user.saves = user.saves || [];
      
      const existingSaveIndex = user.saves.findIndex(s => s.name === saveName);
      if (existingSaveIndex >= 0) {
        user.saves[existingSaveIndex].gameData = gameData;
      } else {
        user.saves.push({ name: saveName, gameData: gameData });
      }
      
      await redis.set(userKey, user);
      return res.status(200).json({ message: 'Game saved successfully!' });
    }

    return res.status(400).json({ error: 'Invalid action.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection error' });
  }
};
