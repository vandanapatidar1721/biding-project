import { DbClient, withTransaction } from '../db/pool';

export interface Bid {
  id: number;
  auction_id: number;
  dealer_id: number;
  amount: string;
  idempotency_key: string;
  created_at: string;
}

export interface PlaceBidInput {
  auctionId: number;
  dealerId: number;
  amount: number;
  idempotencyKey: string;
}

async function placeBidWithClient(
  client: DbClient,
  { auctionId, dealerId, amount, idempotencyKey }: PlaceBidInput,
): Promise<{ bid: Bid; currentPrice: string }> {
  const existing = await client.query<Bid>(
    `SELECT * FROM bids WHERE auction_id = ? AND dealer_id = ? AND idempotency_key = ?`,
    [auctionId, dealerId, idempotencyKey],
  );
  if (existing.rows[0]) {
    const auctionResult = await client.query<{ current_price: string }>(
      `SELECT current_price FROM auctions WHERE id = ?`,
      [auctionId],
    );
    return { bid: existing.rows[0], currentPrice: auctionResult.rows[0].current_price };
  }

  const auctionResult = await client.query<{
    id: number;
    status: string;
    current_price: string;
    end_time: string;
  }>(`SELECT id, status, current_price, end_time FROM auctions WHERE id = ? FOR UPDATE`, [
    auctionId,
  ]);

  const auction = auctionResult.rows[0];
  if (!auction) {
    throw new Error('Auction not found');
  }

  const nowResult = await client.query<{ now: string }>(`SELECT NOW() as now`);
  const now = new Date(nowResult.rows[0].now);
  const endTime = new Date(auction.end_time);

  if (auction.status !== 'OPEN') {
    throw new Error('Auction is not open for bidding');
  }
  if (now >= endTime) {
    throw new Error('Auction has expired');
  }

  const currentPrice = parseFloat(auction.current_price);
  if (amount <= currentPrice) {
    throw new Error('Bid must be strictly higher than current price');
  }
  if (amount <= 0) {
    throw new Error('Bid amount must be positive');
  }

  await client.query(
    `INSERT INTO bids (auction_id, dealer_id, amount, idempotency_key) VALUES (?, ?, ?, ?)`,
    [auctionId, dealerId, amount, idempotencyKey],
  );
  const bidIdResult = await client.query<{ id: number }>(`SELECT LAST_INSERT_ID() as id`);
  const bidId = bidIdResult.rows[0].id;
  const bidRow = await client.query<Bid>(`SELECT * FROM bids WHERE id = ?`, [bidId]);
  const bid = bidRow.rows[0];

  await client.query(
    `UPDATE auctions SET current_price = ?, updated_at = NOW() WHERE id = ?`,
    [amount, auctionId],
  );

  return { bid, currentPrice: amount.toFixed(2) };
}

export async function placeBid(input: PlaceBidInput) {
  return withTransaction(async (client) => placeBidWithClient(client, input));
}

