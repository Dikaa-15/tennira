import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const isSSL = process.env.DB_SSL === 'true';

    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 4000,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'safarku',
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      ssl: isSSL
        ? {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
          }
        : undefined,
    });
  }
  return pool;
}

export default getDbPool;
