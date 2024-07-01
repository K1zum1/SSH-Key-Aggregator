// api/getKeys.js
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    const result = await sql`
      SELECT * FROM SSHKeys;
    `;
    response.status(200).json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
