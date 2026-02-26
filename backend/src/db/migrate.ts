import fs from 'fs';
import path from 'path';
import { pool } from './pool';

export async function runMigrations(): Promise<void> {
  const schemaPath = path.join(__dirname, '..', '..', 'sql', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await pool.execute(statement);
  }
}
