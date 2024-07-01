import { saveAs } from 'file-saver';

export const downloadKeys = (keys) => {
  const formattedKeys = keys.map(key => 
    `SSH Private Key:\n${key.sshPrivKey}\n\nSSH Public Key:\n${key.sshPubKey}\n\nKey Type: ${key.keyType}\n`
  ).join('\n\n');
  const blob = new Blob([formattedKeys], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'ssh_keys.txt');
};
