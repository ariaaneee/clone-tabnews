import { Pool } from "pg";

async function query(queryObject) {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  const client = await pool.connect();

  try {
    const result = await pool.query(queryObject);
    client.release();
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    await pool.end();
  }
}

export default {
  query,
};
