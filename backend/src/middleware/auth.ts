import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env, UserRole } from '../config/env';

export interface AuthUser {
  id: number;
  role: UserRole;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function signToken(user: AuthUser): string {
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };

  // Cast env.jwtSecret and options to the wider type expected by jsonwebtoken
  return jwt.sign(payload, env.jwtSecret as jwt.Secret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  } as jwt.SignOptions);
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload | string;

    if (typeof decoded !== 'object' || decoded === null || typeof decoded.sub !== 'number') {
      throw new Error('Invalid token payload');
    }

    const { sub, role, email } = decoded as JwtPayload & { sub: number; role: UserRole; email: string };

    req.user = {
      id: sub,
      role,
      email,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(role: UserRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
}

