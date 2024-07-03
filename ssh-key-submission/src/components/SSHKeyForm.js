import React, { useState } from 'react';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');

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
      setError('Invalid SSH Private Key format.');
      return;
    }

    onSubmit({ sshPrivKey, sshPubKey });
    setSSHPrivKey('');
    setSSHPubKey('');
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
      />
      <textarea
        value={sshPubKey}
        onChange={(e) => setSSHPubKey(e.target.value)}
        placeholder="Enter your SSH Public Key..."
        rows="4"
        cols="50"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SSHKeyForm;