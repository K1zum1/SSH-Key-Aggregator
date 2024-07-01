import React, { useState } from 'react';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [keyType, setKeyType] = useState('');
  const [error, setError] = useState('');

  const isValidSSHPrivateKey = (key) => {
    return key.includes('-----BEGIN') && key.includes('-----END');
  };

  const isValidSSHPublicKey = (key) => {
    const pattern = /^(ssh-(rsa|dss|ed25519|ecdsa)) [A-Za-z0-9+/]+={0,3}( .+)?$/;
    return pattern.test(key);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!sshPrivKey.trim() || !sshPubKey.trim() || !keyType.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    if (!isValidSSHPrivateKey(sshPrivKey)) {
      setError('Invalid SSH Private Key.');
      return;
    }

    if (!isValidSSHPublicKey(sshPubKey)) {
      setError('Invalid SSH Public Key.');
      return;
    }

    onSubmit({ sshPrivKey, sshPubKey, keyType });
    setSSHPrivKey('');
    setSSHPubKey('');
    setKeyType('');
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
      <select
        value={keyType}
        onChange={(e) => setKeyType(e.target.value)}
      >
        <option value="">Select Key Type</option>
        <option value="RSA">RSA</option>
        <option value="DSA">DSA</option>
        <option value="ECDSA">ECDSA</option>
        <option value="Ed25519">Ed25519</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SSHKeyForm;
