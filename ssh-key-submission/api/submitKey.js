// api/submitKey.js
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { sshPrivKey, sshPubKey, keyType } = request.body;

  try {
    const result = await sql`
      INSERT INTO SSHKeys (sshPrivKey, sshPubKey, keyType)
      VALUES (${sshPrivKey}, ${sshPubKey}, ${keyType});
    `;
    response.status(200).json({ result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
