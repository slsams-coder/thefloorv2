module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Tells your game "We checked the database, but there is no saved game data yet"
  return res.status(200).json({ message: 'No save found.' });
};
