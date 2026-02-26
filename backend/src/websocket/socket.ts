import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env, UserRole } from '../config/env';

interface SocketUser {
  id: number;
  role: UserRole;
  email: string;
}

declare module 'socket.io' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Socket {
    user?: SocketUser;
  }
}

function authenticateSocket(socket: Socket, next: (err?: Error) => void): void {
  const token =
    (socket.handshake.auth && (socket.handshake.auth as any).token) ||
    socket.handshake.headers.authorization?.replace('Bearer ', '') ||
    socket.handshake.query.token;

  if (!token || typeof token !== 'string') {
    next(new Error('Unauthorized'));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload | string;

    if (typeof decoded !== 'object' || decoded === null || typeof decoded.sub !== 'number') {
      throw new Error('Invalid token payload');
    }

    const { sub, role, email } = decoded as JwtPayload & { sub: number; role: UserRole; email: string };

    socket.user = {
      id: sub,
      role,
      email,
    };
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
}

export function createSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
    },
  });

  const pubClient = new Redis(env.redisUrl);
  const subClient = new Redis(env.redisUrl);
  io.adapter(createAdapter(pubClient, subClient));

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    socket.on('join_auction', (auctionId: number) => {
      if (!socket.user) {
        socket.disconnect();
        return;
      }
      const room = `auction:${auctionId}`;
      socket.join(room);
    });

    socket.on('leave_auction', (auctionId: number) => {
      const room = `auction:${auctionId}`;
      socket.leave(room);
    });
  });

  const redisSub = new Redis(env.redisUrl);
  redisSub.psubscribe('auction.*.bids', (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Redis psubscribe error', err);
    }
  });

  redisSub.on('pmessage', (_pattern, channel, message) => {
    const match = channel.match(/^auction\.(\d+)\.bids$/);
    if (!match) return;
    const auctionId = match[1];
    const room = `auction:${auctionId}`;
    try {
      const payload = JSON.parse(message);
      io.to(room).emit('auction_event', payload);
    } catch {
      // ignore malformed
    }
  });

  return io;
}

