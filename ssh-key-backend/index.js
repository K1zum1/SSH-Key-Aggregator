const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sshkeys', { useNewUrlParser: true, useUnifiedTopology: true });

const sshKeySchema = new mongoose.Schema({
  key: String,
});

const SSHKey = mongoose.model('SSHKey', sshKeySchema);

app.get('/keys', async (req, res) => {
  const keys = await SSHKey.find();
  res.json(keys);
});

app.post('/keys', async (req, res) => {
  const key = new SSHKey({ key: req.body.key });
  await key.save();
  res.status(201).json(key);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
