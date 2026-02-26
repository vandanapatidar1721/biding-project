import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticate, requireRole } from '../middleware/auth';
import {
  createAuction,
  listAuctions,
  getAuctionById,
  openAuction,
  closeAuction,
} from '../services/auctionService';

const router = Router();

router.get('/', async (_req, res: Response): Promise<void> => {
  const auctions = await listAuctions();
  res.json(auctions);
});

router.get('/:id', async (req, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Invalid auction id' });
    return;
  }
  const auction = await getAuctionById(id);
  if (!auction) {
    res.status(404).json({ message: 'Auction not found' });
    return;
  }
  res.json(auction);
});

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { title, description, starting_price, end_time } = req.body as {
      title?: string;
      description?: string;
      starting_price?: number;
      end_time?: string;
    };

    if (!title || starting_price === undefined || !end_time) {
      res
        .status(400)
        .json({ message: 'title, starting_price and end_time are required' });
      return;
    }
    if (starting_price < 0) {
      res.status(400).json({ message: 'starting_price must be non-negative' });
      return;
    }

    const auction = await createAuction(
      {
        title,
        description,
        starting_price,
        end_time,
      },
      req.user!,
    );
    // eslint-disable-next-line no-console
    console.log('Auction created', {
      id: auction.id,
      title: auction.title,
      created_by: auction.created_by,
    });
    res.status(201).json(auction);
  },
);

router.post(
  '/:id/start',
  authenticate,
  requireRole('ADMIN'),
  async (req, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Invalid auction id' });
      return;
    }
    try {
      const auction = await openAuction(id);
      if (!auction) {
        res.status(404).json({ message: 'Auction not found' });
        return;
      }
      // eslint-disable-next-line no-console
      console.log('Auction started', { id: auction.id, title: auction.title });
      res.json(auction);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
);

router.post(
  '/:id/close',
  authenticate,
  requireRole('ADMIN'),
  async (req, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Invalid auction id' });
      return;
    }
    try {
      const auction = await closeAuction(id);
      if (!auction) {
        res.status(404).json({ message: 'Auction not found' });
        return;
      }
      // eslint-disable-next-line no-console
      console.log('Auction closed', { id: auction.id, title: auction.title });
      res.json(auction);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
);

export default router;

