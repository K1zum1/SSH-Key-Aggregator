import { saveAs } from 'file-saver';

export const downloadKeys = (keys) => {
  const formattedKeys = keys.map(key => `SSH Key: ${key.sshKey}, Username: ${key.username}, Key Type: ${key.KeyType}`).join('\n');
  const blob = new Blob([formattedKeys], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'ssh_keys.txt');
};
