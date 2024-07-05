import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, QueryResult } from '@vercel/postgres';
import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

interface SSHKey {
  PubKey: string;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const { rows }: QueryResult<SSHKey> = await sql`SELECT PubKey FROM SSHKeys`;

    if (rows.length === 0) {
      throw new Error('No SSH keys found in the database.');
    }

    const krlContent = rows.map((key) => key.PubKey).join('\n');

    const filePath = '/tmp/revocation-list.krl';
    await writeFile(filePath, krlContent);

    const fileContent = await readFile(filePath);

    response.setHeader('Content-Disposition', 'attachment; filename=revocation-list.krl');
    response.setHeader('Content-Type', 'application/octet-stream');
    response.status(200).send(fileContent);
  } catch (error) {
    console.error('Error generating KRL file:', error);
    response.status(500).json({ error: 'Failed to generate KRL file' });
  }
}
