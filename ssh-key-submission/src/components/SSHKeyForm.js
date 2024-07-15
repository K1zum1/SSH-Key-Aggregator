import React, { useState } from 'react';
import '../style/SSHKeyForm.css';
import axios from 'axios';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');

  const keyTypeMap = new Map([
    ['ssh-rsa', 'RSA'],
    ['ssh-dss', 'DSA'],
    ['ssh-ed25519', 'ED25519'],
    ['ecdsa-sha2-nistp256', 'ECDSA 256'],
    ['ecdsa-sha2-nistp384', 'ECDSA 384'],
    ['ecdsa-sha2-nistp521', 'ECDSA 521']
  ]);

  const extractKeyType = (pubKey) => {
    for (const [key, value] of keyTypeMap) {
      if (pubKey.startsWith(key)) {
        return value;
      }
    }
    return 'UNKNOWN INVALID KEY';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sshPrivKey.trim() || !sshPubKey.trim()) {
      setError('Please fill out all fields.');
      clearError();
      return;
    }

    const isPrivKeyValid = isValidSSHKey(sshPrivKey, 'private');
    const isPubKeyValid = isValidSSHKey(sshPubKey, 'public');
    const isPrivKeyEncrypted = isPassphraseProtected(sshPrivKey);

    if (isPrivKeyEncrypted) {
      setError('SSH private key is passphrase-protected. Please enter only non-passphrase protected keys.');
      clearError();
    } else if (!isPrivKeyValid && !isPubKeyValid) {
      setError('Invalid SSH private and public key formats.');
      clearError();
    } else if (!isPrivKeyValid) {
      setError('Invalid SSH private key format.');
      clearError();
    } else if (!isPubKeyValid) {
      setError('Invalid SSH public key format.');
      clearError();
    } else {
      const keyType = extractKeyType(sshPubKey);
      const fingerprint = await calculateFingerprint(sshPubKey); 
      onSubmit({ sshPrivKey, sshPubKey, keyType, fingerprint });
      setSSHPrivKey('');
      setSSHPubKey('');
    }
  };

  const isValidSSHKey = (key, type) => {
    let regex;
    if (type === 'private') {
      regex = /^-----BEGIN ((EC|PGP|DSA|RSA|OPENSSH) )?PRIVATE KEY-----(.|\n|\r)*?-----END ((EC|PGP|DSA|RSA|OPENSSH) )?PRIVATE KEY-----$/;
    } else {
      regex = /^ssh-(rsa|dss|ed25519|ecdsa-sha2-nistp(256|384|521))\s+[A-Za-z0-9+/=]+\s*(\S+\s*)?$/;
    }
    return regex.test(key.trim());
  };

  const isPassphraseProtected = (privKey) => {
    return privKey.includes('Proc-Type: 4,ENCRYPTED') && privKey.includes('DEK-Info');
  };

  const calculateFingerprint = async (pubKey) => {
    try {
      const response = await axios.post('/api/validate-key', { key: pubKey });
      return response.data; 
    } catch (error) {
      console.error('Error calculating fingerprint:', error);
      return 'Fingerprint calculation failed';
    }
  };

  const clearError = () => {
    setTimeout(() => setError(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="error-placeholder">
        {error && <p className="error">{error}</p>}
      </div>
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
      <button type="submit" className='submitButton'>SUBMIT</button>
    </form>
  );
};

export default SSHKeyForm;
