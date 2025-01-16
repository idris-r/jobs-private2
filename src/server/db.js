import { createClient } from '@libsql/client';

const db = createClient({
  url: 'file:local.db',
});

export const initDb = async () => {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        token_balance INTEGER DEFAULT 40,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Create tokens_history table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tokens_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        action TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const createUser = async (email, hashedPassword) => {
  try {
    const result = await db.execute({
      sql: 'INSERT INTO users (email, password) VALUES (?, ?)',
      args: [email, hashedPassword]
    });
    return result.lastInsertRowid;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const getUser = async (email) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateTokenBalance = async (userId, newBalance) => {
  try {
    await db.execute({
      sql: 'UPDATE users SET token_balance = ? WHERE id = ?',
      args: [newBalance, userId]
    });
  } catch (error) {
    console.error('Error updating token balance:', error);
    throw error;
  }
};

export const logTokenUsage = async (userId, amount, action) => {
  try {
    await db.execute({
      sql: 'INSERT INTO tokens_history (user_id, amount, action) VALUES (?, ?, ?)',
      args: [userId, amount, action]
    });
  } catch (error) {
    console.error('Error logging token usage:', error);
    throw error;
  }
};

export const updateLastLogin = async (userId) => {
  try {
    await db.execute({
      sql: 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      args: [userId]
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await db.execute({
      sql: 'DELETE FROM tokens_history WHERE user_id = ?',
      args: [userId]
    });
    await db.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [userId]
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export default db;
