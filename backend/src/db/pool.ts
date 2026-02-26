import mysql from 'mysql2/promise';
import { env } from '../config/env';

function getPoolConfig(): mysql.PoolOptions {
  const url = env.databaseUrl;
  if (url.startsWith('mysql://')) {
    const match = url.match(
      /^mysql:\/\/([^:]+):([^@]+)@([^:/]+):?(\d+)?\/(.*)?$/,
    );
    if (match) {
      const [, user, password, host, port, database] = match;
      return {
        host: host || 'localhost',
        port: port ? parseInt(port, 10) : 3306,
        user,
        password,
        database: database ? database.split('?')[0] : undefined,
        waitForConnections: true,
        connectionLimit: 10,
      };
    }
  }
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
  };
}

const poolConfig = getPoolConfig();
export const pool = mysql.createPool(poolConfig);

/** Result shape compatible with pg-style { rows } for easier migration */
export interface QueryResult<T = unknown> {
  rows: T[];
}

/** Run a query and return pg-style { rows } (mysql2 returns [rows, fields]) */
export async function query<T = unknown>(
  sql: string,
  params?: (string | number | null)[],
): Promise<QueryResult<T>> {
  const [rows] = await pool.execute(sql, params ?? []);
  return { rows: (Array.isArray(rows) ? rows : []) as T[] };
}

/** Connection with query and transaction helpers; pg PoolClient-compatible shape */
export interface DbClient {
  query: <T = unknown>(
    sql: string,
    params?: (string | number | null)[],
  ) => Promise<QueryResult<T>>;
  release: () => void;
}

export async function withTransaction<T>(
  fn: (client: DbClient) => Promise<T>,
): Promise<T> {
  const conn = await pool.getConnection();
  const client: DbClient = {
    async query<T>(sql: string, params?: (string | number | null)[]) {
      const [rows] = await conn.execute(sql, params ?? []);
      return { rows: (Array.isArray(rows) ? rows : []) as T[] };
    },
    release: () => conn.release(),
  };
  try {
    await conn.beginTransaction();
    const result = await fn(client);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
