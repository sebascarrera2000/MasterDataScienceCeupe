// src/db.js  (Pool global a Session Pooler)
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

// Forzar SSL (Supabase lo requiere en pooler)
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,            // tamaño del pool en tu app (ajusta según Railway)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

export async function sql(query, params = []) {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } finally {
    client.release();
  }
}

export { pool };
