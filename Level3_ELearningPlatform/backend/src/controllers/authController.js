import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockUsers } from '../data/mockData.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'dev_secret_change_me', {
    expiresIn: '7d',
  });
}

function sanitizeUser(user) {
  const { password, ...safe } = user.toObject ? user.toObject() : user;
  return safe;
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!isDbConnected()) {
      // Mock mode — simulate a successful signup without persisting.
      const fakeUser = {
        _id: `u${Date.now()}`,
        name,
        email,
        role: 'student',
        avatarInitials: name
          .split(' ')
          .map((p) => p[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        streak: 0,
        totalHoursLearned: 0,
        certificatesEarned: 0,
      };
      return res.status(201).json({ user: fakeUser, token: signToken(fakeUser._id) });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const initials = name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const user = await User.create({ name, email, password: hashedPassword, avatarInitials: initials });
    res.status(201).json({ user: sanitizeUser(user), token: signToken(user._id) });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isDbConnected()) {
      const mockUser = mockUsers.find((u) => u.email === email) || mockUsers[0];
      return res.json({ user: mockUser, token: signToken(mockUser._id) });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({ user: sanitizeUser(user), token: signToken(user._id) });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    if (!isDbConnected()) {
      return res.json(mockUsers[0]);
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
}
