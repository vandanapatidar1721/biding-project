import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { placeBid } from '../services/bidService';
import { publishBidEvent } from '../websocket/pubsub';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticate,
  requireRole('DEALER'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const auctionId = Number(req.params.id);
    const { amount, idempotencyKey } = req.body as {
      amount?: number;
      idempotencyKey?: string;
    };

    if (Number.isNaN(auctionId)) {
      res.status(400).json({ message: 'Invalid auction id' });
      return;
    }
    if (amount === undefined || typeof amount !== 'number') {
      res.status(400).json({ message: 'amount is required and must be a number' });
      return;
    }
    if (amount <= 0) {
      res.status(400).json({ message: 'Bid amount must be positive' });
      return;
    }
    if (!idempotencyKey) {
      res.status(400).json({ message: 'idempotencyKey is required' });
      return;
    }

    try {
      const { bid, currentPrice } = await placeBid({
        auctionId,
        dealerId: req.user!.id,
        amount,
        idempotencyKey,
      });

      await publishBidEvent(auctionId, {
        type: 'bid_placed',
        payload: {
          bid,
          currentPrice,
        },
      });

      // eslint-disable-next-line no-console
      console.log('Bid placed', {
        bidId: bid.id,
        auctionId,
        dealerId: req.user!.id,
        amount,
      });

      res.status(201).json({ bid, currentPrice });
    } catch (err: any) {
      const message = err.message as string;
      if (
        message === 'Auction not found' ||
        message === 'Auction is not open for bidding' ||
        message === 'Auction has expired' ||
        message === 'Bid must be strictly higher than current price' ||
        message === 'Bid amount must be positive'
      ) {
        res.status(400).json({ message });
        return;
      }
      // eslint-disable-next-line no-console
      console.error('Place bid error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

export default router;

