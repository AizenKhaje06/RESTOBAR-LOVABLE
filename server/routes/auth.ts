import { RequestHandler } from 'express';
import { AuthResponse, User, UserRole } from '@shared/api';

// Mock user database - in production, use a real database
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@restaubar.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@restaubar.com',
      role: 'admin' as UserRole,
    },
  },
  'pos@restaubar.com': {
    password: 'pos123',
    user: {
      id: '2',
      name: 'POS User',
      email: 'pos@restaubar.com',
      role: 'pos' as UserRole,
    },
  },
  'waiter@restaubar.com': {
    password: 'waiter123',
    user: {
      id: '3',
      name: 'Waiter User',
      email: 'waiter@restaubar.com',
      role: 'waiter' as UserRole,
    },
  },
};

export const handleLogin: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  const userEntry = mockUsers[email];
  if (!userEntry || userEntry.password !== password) {
    const response: AuthResponse = {
      success: false,
      message: 'Invalid email or password',
    };
    return res.status(401).json(response);
  }

  // In production, generate a real JWT token
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

  const response: AuthResponse = {
    success: true,
    message: 'Login successful',
    user: userEntry.user,
    token,
  };
  res.json(response);
};

export const handleLogout: RequestHandler = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
};

export const handleVerifyToken: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  try {
    // In production, verify JWT token
    res.json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
