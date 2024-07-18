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
  const { privKey, pubKey, keyType, fingerprintValidated } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers.referer || req.headers.referrer;

  if (!privKey || !pubKey || !keyType) {
    return res.status(400).json({ error: 'Private key, public key, and key type are required.' });
  }

  try {
    const checkQuery = 'SELECT * FROM SSHKeys WHERE pubKey = $1 OR privKey = $2';
    const checkResult = await client.query(checkQuery, [pubKey, privKey]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ error: 'This private or public key has already been submitted.' });
    }

    const insertQuery = `
      INSERT INTO SSHKeys (privKey, pubKey, keyType, fingerprintValidated, ipAddress, userAgent, submissionDate, referer) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) 
      RETURNING *`;
    const values = [privKey, pubKey, keyType, fingerprintValidated, ip, userAgent, referer];
    const insertResult = await client.query(insertQuery, values);

    return res.status(200).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error inserting SSH key:', error);
    return res.status(500).json({ error: 'Failed to insert SSH key.' });
  }
}
