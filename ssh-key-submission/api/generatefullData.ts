import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL, 
});

client.connect();

export default async function generateKRL(req: VercelRequest, res: VercelResponse) {
  try {
    const query = 'SELECT privKey, pubKey, keyType, ipAddress, userAgent, submissionDate, referer, fingerprintValidated FROM SSHKeys';
    const result = await client.query(query);

    const fullData = result.rows;

    return res.status(200).json(fullData);
  } catch (error) {
    console.error('Error generating full data:', error);
    return res.status(500).json({ error: 'Failed to grab data.' });
  }
}
