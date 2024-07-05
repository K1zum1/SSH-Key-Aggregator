import React, { useState } from 'react';
import '../style/SSHKeyForm.css';
import { parseKey } from 'ssh-keygen'; // Import parseKey from ssh-keygen

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');

  const isValidSSHPrivateKey = (key) => {
    // Basic format check
    return key.includes('-----BEGIN') && key.includes('-----END');
  };

  const isValidSSHKey = (key) => {
    try {
      const parsedKey = parseKey(key); 
      return !!parsedKey; 
    } catch (error) {
      return false; 
    }
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

    if (!isValidSSHKey(sshPubKey)) {
      setError('Invalid SSH Public Key.');
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
