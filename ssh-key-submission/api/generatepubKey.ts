import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL, 
});

client.connect();

export default async function generateKRL(req: VercelRequest, res: VercelResponse) {
  try {
    const query = 'SELECT pubKey FROM SSHKeys';
    const result = await client.query(query);

    const pubData = result.rows;

    return res.status(200).json(pubData);
  } catch (error) {
    console.error('Error generating KRL:', error);
    return res.status(500).json({ error: 'Failed to grab JSON data.' });
  }
}
