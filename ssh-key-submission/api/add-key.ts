import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const { privKey, pubKey } = request.body;

    if (!privKey || !pubKey) {
      throw new Error('Both SSH private and public keys are required.');
    }

    await sql`INSERT INTO SSHKeys (PrivKey, PubKey) VALUES (${privKey}, ${pubKey})`;

    const sshKeys = await sql`SELECT * FROM SSHKeys`;

    return response.status(200).json({ sshKeys });
  } catch (error) {
    console.error('Error processing SSH key submission:', error);
    return response.status(500).json({ error: 'Failed to process SSH key submission' });
  }
}
