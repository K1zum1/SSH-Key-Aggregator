// api/submitKey.js
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const { sshPrivKey, sshPubKey, keyType } = request.body;

  if (!sshPrivKey || !sshPubKey || !keyType) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await sql`
      INSERT INTO sshkeys (sshPrivKey, sshPubKey, keyType)
      VALUES (${sshPrivKey}, ${sshPubKey}, ${keyType})
      RETURNING *;
    `;
    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return response.status(500).json({ error: 'Database error occurred: ' + error.message });
  }
}
