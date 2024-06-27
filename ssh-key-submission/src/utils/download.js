import { saveAs } from 'file-saver';

export const downloadKeys = (keys) => {
  const formattedKeys = keys.map(key => `SSH Private Key: ${key.sshPrivKey}\nSSH Public Key: ${key.sshPubKey}\nKey Type: ${key.KeyType}\n`).join('\n\n');
  const blob = new Blob([formattedKeys], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'ssh_keys.txt');
};
