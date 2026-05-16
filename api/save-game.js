module.exports = async function handler(req, res) {
  // Only allow POST requests (which is what your frontend sends)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Tells your game "Yes, the account was created perfectly!"
  return res.status(200).json({ message: 'Account successfully created!' });
};
