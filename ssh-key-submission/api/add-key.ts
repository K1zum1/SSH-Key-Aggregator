import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect().catch((err) => {
  console.error('Connection error:', err.stack);
  process.exit(1);
});

export default async function addKey(req: VercelRequest, res: VercelResponse) {
  const { privKey, pubKey, keyType } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!privKey || !pubKey || !keyType) {
    return res.status(400).json({ error: 'Private key, public key, and key type are required.' });
  }

  try {
    const query = 'INSERT INTO SSHKeys (privKey, pubKey, keyType, ipAddress) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [privKey, pubKey, keyType, ip];
    const result = await client.query(query, values);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting SSH key:', error);
    return res.status(500).json({ error: 'Failed to insert SSH key.' });
  }
}
