// api/submitKey.js
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { sshPrivKey, sshPubKey, keyType } = request.body;

  try {
    const result = await sql`
      INSERT INTO "sshkeys" ("sshPrivKey", "sshPubKey", "keyType")
      VALUES (${sshPrivKey}, ${sshPubKey}, ${keyType})
      RETURNING *;
    `;
    return response.status(200).json(result); // Assuming `result` is the inserted row(s)
  } catch (error) {
    console.error('Error inserting SSH key:', error);
    return response.status(500).json({ error: 'Failed to insert SSH key.' });
  }
}
