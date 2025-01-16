import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUser, updateLastLogin } from './db.js';

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

export const register = async (email, password) => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = await createUser(email, hashedPassword);

    // Generate JWT token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });

    return { token, userId };
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    // Get user
    const user = await getUser(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '24h' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        tokenBalance: user.token_balance
      }
    };
  } catch (error) {
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
