import React, { useState } from 'react';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');

  const getKeyTypeFromPublicKey = (key) => {
    const patterns = {
      'RSA': /^(ssh-rsa) [A-Za-z0-9+/]+={0,3}( .+)?$/,
      'DSA': /^(ssh-dss) [A-Za-z0-9+/]+={0,3}( .+)?$/,
      'ECDSA': /^(ecdsa-sha2-nistp256) [A-Za-z0-9+/]+={0,3}( .+)?$/,
      'Ed25519': /^(ssh-ed25519) [A-Za-z0-9+/]+={0,3}( .+)?$/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(key)) {
        return type;
      }
    }

    return null; 
  };

  const isValidSSHPrivateKey = (key) => {
    return key.includes('-----BEGIN') && key.includes('-----END');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!sshPrivKey.trim() || !sshPubKey.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    if (!isValidSSHPrivateKey(sshPrivKey)) {
      setError('Invalid SSH Private Key.');
      return;
    }

    const keyType = getKeyTypeFromPublicKey(sshPubKey);
    if (!keyType) {
      setError('Invalid SSH Public Key.');
      return;
    }

    onSubmit({ sshPrivKey, sshPubKey, keyType });
    setSSHPrivKey('');
    setSSHPubKey('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <textarea
        value={sshPrivKey}
        onChange={(e) => setSSHPrivKey(e.target.value)}
        placeholder="Enter your SSH Private Key, including '-----BEGIN PRIVATE KEY-----' and '-----END PRIVATE KEY-----'"
        rows="4"
        cols="50"
      />
      <textarea
        value={sshPubKey}
        onChange={(e) => setSSHPubKey(e.target.value)}
        placeholder="Enter your SSH Public Key, starting with 'ssh-rsa', 'ssh-dss', 'ecdsa-sha2-nistp256', or 'ssh-ed25519'"
        rows="4"
        cols="50"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SSHKeyForm;