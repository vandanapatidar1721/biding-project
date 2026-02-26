import { Redis } from 'ioredis';
import { env } from '../config/env';

let publisher: Redis | null = null;

export interface BidEvent {
  type: 'bid_placed';
  payload: unknown;
}

export function getPublisher(): Redis {
  if (!publisher) {
    publisher = new Redis(env.redisUrl);
  }
  return publisher;
}

export async function publishBidEvent(
  auctionId: number,
  event: BidEvent,
): Promise<void> {
  const channel = `auction.${auctionId}.bids`;
  const payload = JSON.stringify(event);
  await getPublisher().publish(channel, payload);
}

