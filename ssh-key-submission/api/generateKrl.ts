// import { VercelRequest, VercelResponse } from '@vercel/node';
// import { Client } from 'pg';
// import { writeFileSync, promises as fsPromises } from 'fs';
// import { join } from 'path';

// const client = new Client({
//   connectionString: process.env.POSTGRES_URL,
// });

// client.connect().catch((err) => {
//   console.error('Connection error:', err.stack);
//   process.exit(1);
// });

// export default async function generateKrl(req: VercelRequest, res: VercelResponse) {
//   try {
//     const query = 'SELECT pubKey FROM SSHKeys';
//     const result = await client.query(query);
//     const keys = result.rows.map(row => row.pubKey);

    
//     const krlContent = `# KRL Generated on ${new Date().toISOString()}\n`;
//     const krlKeys = keys.map(key => `revoked-keys: ${key}`).join('\n');
//     const fullKrlContent = krlContent + krlKeys;

    
//     const krlFilePath = join('/tmp', 'revocation-list.krl');
//     writeFileSync(krlFilePath, fullKrlContent);

    
//     const krlFile = await fsPromises.readFile(krlFilePath, 'utf-8');
//     res.setHeader('Content-Type', 'application/octet-stream');
//     res.setHeader('Content-Disposition', 'attachment; filename=revocation-list.krl');
//     res.status(200).send(krlFile);
//   } catch (error) {
//     console.error('Error generating KRL file:', error);
//     res.status(500).json({ error: 'Failed to generate KRL file.' });
//   }
// }
