import { saveAs } from 'file-saver';

export const downloadKeys = (keys) => {
  const blob = new Blob([keys.join('\n')], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'ssh_keys.txt');
};
