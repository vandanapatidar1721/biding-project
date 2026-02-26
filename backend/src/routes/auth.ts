import { Router, Request, Response } from 'express';
import { createUser, findUserByEmail } from '../services/userService';
import { signToken } from '../middleware/auth';
import { UserRole } from '../config/env';
import bcrypt from 'bcryptjs';

const router = Router();

router.post(
  '/signup',
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as {
      email?: string;
      password?: string;
      role?: UserRole;
    };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const normalizedRole: UserRole = role === 'ADMIN' ? 'ADMIN' : 'DEALER';
    // eslint-disable-next-line no-console
    console.log('Signup request', { email, role: normalizedRole });

    try {
      const existing = await findUserByEmail(email);
      if (existing) {
        res.status(409).json({ message: 'Email already in use' });
        return;
      }

      const user = await createUser(email, password, normalizedRole);
      // eslint-disable-next-line no-console
      console.log('Signup success', {
        id: user.id,
        email: user.email,
        role: user.role,
      });
      const token = signToken({
        id: user.id,
        role: user.role,
        email: user.email,
      });
      res.status(201).json({ token, user });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Signup error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

router.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    try {
      const user = await findUserByEmail(email);
      if (!user) {
        // eslint-disable-next-line no-console
        console.log('Login failed: user not found', { email });
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        // eslint-disable-next-line no-console
        console.log('Login failed: invalid password', { email });
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = signToken({
        id: user.id,
        role: user.role,
        email: user.email,
      });
      // eslint-disable-next-line no-console
      console.log('Login success', {
        id: user.id,
        email: user.email,
        role: user.role,
      });
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

export default router;

