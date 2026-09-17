import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { sendPasswordResetEmail, sendSignupVerificationEmail } from '../../config/mail.js';

const VERIFICATION_TTL_MS = 10 * 60 * 1000;

const createVerificationCode = () => String(crypto.randomInt(100000, 1000000));

const saveVerificationCode = async (user) => {
  const code = createVerificationCode();
  user.verificationCodeHash = crypto.createHash('sha256').update(code).digest('hex');
  user.verificationCodeExpiry = Date.now() + VERIFICATION_TTL_MS;
  await user.save();
  await sendSignupVerificationEmail({ email: user.email, name: user.name, code });
};

export const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ message: 'Name, email, and a password of at least 8 characters are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing && existing.emailVerified !== false) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = existing || new User({ name, email });
    user.name = name;
    user.password = hashed;
    user.emailVerified = false;
    await user.save();
    await saveVerificationCode(user);
    res.status(202).json({ message: 'Verification code sent. Check your email to finish signing up.', email });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailVerified === false) return res.status(403).json({ message: 'Please verify your email before signing in.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const verifySignup = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const code = req.body.code?.trim();
    if (!email || !/^\d{6}$/.test(code || '')) return res.status(400).json({ message: 'Email and a 6-digit verification code are required.' });

    const user = await User.findOne({ email });
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    if (!user || user.emailVerified || user.verificationCodeHash !== codeHash || !user.verificationCodeExpiry || user.verificationCodeExpiry <= Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    user.emailVerified = true;
    user.verificationCodeHash = '';
    user.verificationCodeExpiry = null;
    await user.save();
    res.status(201).json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Email verification failed', error: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = email ? await User.findOne({ email }) : null;
    if (!user || user.emailVerified) return res.json({ message: 'If the account requires verification, a new code has been sent.' });
    await saveVerificationCode(user);
    res.json({ message: 'If the account requires verification, a new code has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not resend verification code', error: error.message });
  }
};

export const logout = (_req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If an account exists, a reset link has been sent.' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();
    await sendPasswordResetEmail({ email: user.email, name: user.name, token });

    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Forgot password failed', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ message: 'A valid token and a password of at least 8 characters are required.' });
    }
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token.' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = '';
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Reset password failed', error: error.message });
  }
};
