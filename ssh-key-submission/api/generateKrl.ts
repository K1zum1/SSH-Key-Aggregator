import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL, 
});

client.connect();

export default async function generateKRL(req: VercelRequest, res: VercelResponse) {
  try {
    const query = 'SELECT privKey, pubKey, keyType, ipAddress FROM SSHKeys';
    const result = await client.query(query);

    const krlData = result.rows;

    return res.status(200).json(krlData);
  } catch (error) {
    console.error('Error generating KRL:', error);
    return res.status(500).json({ error: 'Failed to generate KRL.' });
  }
}
