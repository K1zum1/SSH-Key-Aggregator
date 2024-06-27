import React, { useState } from 'react';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [KeyType, setKeyType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sshPrivKey.trim() && sshPubKey.trim() && KeyType.trim()) {
      onSubmit({ sshPrivKey, sshPubKey, KeyType });
      setSSHPrivKey('');
      setSSHPubKey('');
      setKeyType('');
    } else {
      console.log('Please fill out all fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={sshPrivKey}
        onChange={(e) => setSSHPrivKey(e.target.value)}
        placeholder="Enter your compromised SSH Private Key"
        rows="4"
        cols="50"
      />
      <textarea
        value={sshPubKey}
        onChange={(e) => setSSHPubKey(e.target.value)}
        placeholder="Enter your compromised SSH Public Key"
        rows="4"
        cols="50"
      />
      <select
        value={KeyType}
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