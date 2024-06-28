const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/api/sshkeys', async (req, res) => {
  console.log('POST /api/sshkeys', req.body);
  const { sshPrivKey, sshPubKey, KeyType } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sshkeys (sshPrivKey, sshPubKey, KeyType) VALUES ($1, $2, $3) RETURNING *',
      [sshPrivKey, sshPubKey, KeyType]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sshkeys', async (req, res) => {
  console.log('GET /api/sshkeys');
  try {
    const result = await pool.query('SELECT * FROM sshkeys');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

