import React, { useState } from 'react';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');

  const extractKeyType = (pubKey) => {
    if (pubKey.startsWith('ssh-rsa')) {
      return 'RSA';
    } else if (pubKey.startsWith('ssh-dss')) {
      return 'DSA';
    } else if (pubKey.startsWith('ssh-ed25519')) {
      return 'ED25519';
    } else if (pubKey.startsWith('ecdsa-sha2-nistp256')) {
      return 'ECDSA';
    } else if (pubKey.startsWith('ecdsa-sha2-nistp384')) {
      return 'ECDSA';
    } else if (pubKey.startsWith('ecdsa-sha2-nistp521')) {
      return 'ECDSA';
    } else {
      return 'UNKNOWN INVALID KEY';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!sshPrivKey.trim() || !sshPubKey.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    const isPrivKeyValid = isValidSSHKey(sshPrivKey, 'private');
    const isPubKeyValid = isValidSSHKey(sshPubKey, 'public');

    if (!isPrivKeyValid && !isPubKeyValid) {
      setError('Invalid SSH private and public key formats.');
    } else if (!isPrivKeyValid) {
      setError('Invalid SSH private key format.');
    } else if (!isPubKeyValid) {
      setError('Invalid SSH public key format.');
    } else {
      const keyType = extractKeyType(sshPubKey);
      onSubmit({ sshPrivKey, sshPubKey, keyType });
      setSSHPrivKey('');
      setSSHPubKey('');
    }
  };

  const isValidSSHKey = (key, type) => {
    let regex;
    if (type === 'private') {
      regex = /^-----BEGIN ((EC|PGP|DSA|RSA|OPENSSH) )?PRIVATE KEY-----(.|\n|\r)*?-----END ((EC|PGP|DSA|RSA|OPENSSH) )?PRIVATE KEY-----$/;
    } else {
      regex = /^ssh-(rsa|dss|ed25519|ecdsa-sha2-nistp(256|384|521))\s+[A-Za-z0-9+/=]+\s*(?:\S+\s*)?$/;
    }
    return regex.test(key.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <textarea
        value={sshPrivKey}
        onChange={(e) => setSSHPrivKey(e.target.value)}
        placeholder="Enter your SSH Private Key..."
        rows="4"
        cols="50"
        autoComplete="on" 
      />
      <textarea
        value={sshPubKey}
        onChange={(e) => setSSHPubKey(e.target.value)}
        placeholder="Enter your SSH Public Key..."
        rows="4"
        cols="50"
        autoComplete="on" 
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SSHKeyForm;
