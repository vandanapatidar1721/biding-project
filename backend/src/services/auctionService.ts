import { pool, query, withTransaction } from '../db/pool';
import { AuthUser } from '../middleware/auth';

export type AuctionStatus = 'DRAFT' | 'OPEN' | 'CLOSED';

export interface Auction {
  id: number;
  title: string;
  description: string | null;
  status: AuctionStatus;
  starting_price: string;
  current_price: string;
  end_time: string;
  created_by: number;
  winner_user_id: number | null;
}

export async function createAuction(
  data: {
    title: string;
    description?: string;
    starting_price: number;
    end_time: string;
  },
  admin: AuthUser,
): Promise<Auction> {
  const [insertResult] = await pool.execute(
    `
    INSERT INTO auctions (title, description, status, starting_price, current_price, end_time, created_by)
    VALUES (?, ?, 'DRAFT', ?, ?, ?, ?)
  `,
    [
      data.title,
      data.description ?? null,
      data.starting_price,
      data.starting_price,
      data.end_time,
      admin.id,
    ],
  );
  const insertId = (insertResult as { insertId: number }).insertId;
  const result = await query<Auction>(
    `SELECT * FROM auctions WHERE id = ?`,
    [insertId],
  );
  return result.rows[0] as Auction;
}

export async function listAuctions(): Promise<Auction[]> {
  const result = await query<Auction>(`SELECT * FROM auctions ORDER BY created_at DESC`);
  return result.rows;
}

export async function getAuctionById(id: number): Promise<Auction | null> {
  const result = await query<Auction>(`SELECT * FROM auctions WHERE id = ?`, [id]);
  return result.rows[0] ?? null;
}

export async function openAuction(id: number): Promise<Auction | null> {
  return withTransaction(async (client) => {
    const nowResult = await client.query<{ now: string }>(`SELECT NOW() as now`);
    const now = new Date(nowResult.rows[0].now);

    const selectResult = await client.query<Auction>(
      `SELECT * FROM auctions WHERE id = ? FOR UPDATE`,
      [id],
    );
    const auction = selectResult.rows[0];
    if (!auction) {
      return null;
    }
    if (auction.status !== 'DRAFT') {
      throw new Error('Auction is not in DRAFT status');
    }
    const endTime = new Date(auction.end_time);
    if (endTime <= now) {
      throw new Error('Auction end time is in the past');
    }

    await client.query(
      `UPDATE auctions SET status = 'OPEN', updated_at = NOW() WHERE id = ?`,
      [id],
    );
    const updateResult = await client.query<Auction>(
      `SELECT * FROM auctions WHERE id = ?`,
      [id],
    );
    return updateResult.rows[0];
  });
}

export async function closeAuction(id: number): Promise<Auction | null> {
  return withTransaction(async (client) => {
    const selectResult = await client.query<Auction>(
      `SELECT * FROM auctions WHERE id = ? FOR UPDATE`,
      [id],
    );
    const auction = selectResult.rows[0];
    if (!auction) {
      return null;
    }
    if (auction.status === 'CLOSED') {
      return auction;
    }

    await client.query(
      `UPDATE auctions SET status = 'CLOSED', updated_at = NOW() WHERE id = ?`,
      [id],
    );
    const updateResult = await client.query<Auction>(
      `SELECT * FROM auctions WHERE id = ?`,
      [id],
    );
    return updateResult.rows[0];
  });
}

