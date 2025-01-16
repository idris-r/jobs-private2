import express from 'express';
import { dbGet, dbRun, dbAll } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, email, token_balance, created_at, last_login FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update token balance
router.post('/tokens', authenticateToken, async (req, res) => {
  try {
    const { amount, action } = req.body;
    const userId = req.user.userId;

    // Get current balance
    const user = await dbGet('SELECT token_balance FROM users WHERE id = ?', [userId]);
    const newBalance = user.token_balance + amount;

    // Update balance
    await dbRun(
      'UPDATE users SET token_balance = ? WHERE id = ?',
      [newBalance, userId]
    );

    // Log token transaction
    await dbRun(
      'INSERT INTO tokens_history (user_id, amount, action) VALUES (?, ?, ?)',
      [userId, amount, action]
    );

    res.json({ 
      message: 'Token balance updated',
      newBalance 
    });
  } catch (error) {
    console.error('Error updating tokens:', error);
    res.status(500).json({ error: 'Failed to update tokens' });
  }
});

// Get token history
router.get('/tokens/history', authenticateToken, async (req, res) => {
  try {
    const history = await dbAll(
      'SELECT * FROM tokens_history WHERE user_id = ? ORDER BY timestamp DESC',
      [req.user.userId]
    );
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching token history:', error);
    res.status(500).json({ error: 'Failed to fetch token history' });
  }
});

// Delete account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    // Delete token history
    await dbRun(
      'DELETE FROM tokens_history WHERE user_id = ?',
      [req.user.userId]
    );

    // Delete user
    await dbRun(
      'DELETE FROM users WHERE id = ?',
      [req.user.userId]
    );

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
