import bcrypt from 'bcryptjs';
import { pool, query } from '../db/pool';
import { UserRole } from '../config/env';

export async function createUser(
  email: string,
  password: string,
  role: UserRole,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  const [insertResult] = await pool.execute(
    `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
    [email, passwordHash, role],
  );
  const id = (insertResult as { insertId: number }).insertId;
  const result = await query<{ id: number; email: string; role: UserRole; created_at: string }>(
    `SELECT id, email, role, created_at FROM users WHERE id = ?`,
    [id],
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await query<{ id: number; email: string; password_hash: string; role: UserRole }>(
    `SELECT id, email, password_hash, role FROM users WHERE email = ?`,
    [email],
  );
  return result.rows[0] as
    | { id: number; email: string; password_hash: string; role: UserRole }
    | undefined;
}

