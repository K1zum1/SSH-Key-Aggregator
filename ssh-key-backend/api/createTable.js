// api/createTable.js
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    const result = await sql`
      CREATE TABLE IF NOT EXISTS SSHKeys (
        id SERIAL PRIMARY KEY,
        sshPrivKey TEXT NOT NULL,
        sshPubKey TEXT NOT NULL,
        keyType VARCHAR(50) NOT NULL
      );
    `;
    response.status(200).json({ result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
