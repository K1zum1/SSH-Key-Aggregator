const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/api/generateKRL', (req, res) => {
  const keys = req.body;

  
  const keysFilePath = path.join(__dirname, 'revoked-keys.txt');
  const formattedKeys = keys.map(key => key.sshPubKey).join('\n');
  fs.writeFileSync(keysFilePath, formattedKeys);

  
  const krlFilePath = path.join(__dirname, 'revoked-keys.krl');
  exec(`ssh-keygen -kf ${krlFilePath} -u -f ${keysFilePath}`, (error) => {
    if (error) {
      console.error('Eror generating :', error);
      return res.status(500).send('error generating');
    }

    res.sendFile(krlFilePath, (err) => {
      if (err) {
        console.error('error sending the krl file?:', err);
        res.status(500).send('Error lol');
      }

      fs.unlinkSync(keysFilePath);
      fs.unlinkSync(krlFilePath);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
