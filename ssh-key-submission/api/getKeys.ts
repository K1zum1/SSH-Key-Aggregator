import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const result = await sql`SELECT * FROM SSHKeys;`;
    return response.status(200).json(result);
  } catch (error) {
    console.error('Error fetching SSH keys:', error);
    return response.status(500).json({ error: 'Failed to fetch SSH keys.' });
  }
}