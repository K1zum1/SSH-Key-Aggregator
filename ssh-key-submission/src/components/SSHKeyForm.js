import React, { useState } from 'react';
import axios from 'axios';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

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
    setStatus('Checking formatting of keys...');

    setTimeout(async () => {
      if (!sshPrivKey.trim() || !sshPubKey.trim()) {
        setError('Please fill out all fields.');
        setStatus('');
        clearError();
        clearStatus();
        return;
      }

      const isPrivKeyValid = isValidSSHKey(sshPrivKey, 'private');
      const isPubKeyValid = isValidSSHKey(sshPubKey, 'public');
      const isPrivKeyEncrypted = isPassphraseProtected(sshPrivKey);

      if (isPrivKeyEncrypted) {
        setError('SSH private key is passphrase-protected. Please enter only non-passphrase protected keys.');
        setStatus('');
        clearError();
        clearStatus();
      } else if (!isPrivKeyValid && !isPubKeyValid) {
        setError('Invalid SSH private and public key formats.');
        setStatus('');
        clearError();
        clearStatus();
      } else if (!isPrivKeyValid) {
        setError('Invalid SSH private key format.');
        setStatus('');
        clearError();
        clearStatus();
      } else if (!isPubKeyValid) {
        setError('Invalid SSH public key format.');
        setStatus('');
        clearError();
        clearStatus();
      } else {
        try {
          const keyType = extractKeyType(sshPubKey);
          setStatus('Checking fingerprint of keys...');
          const response = await axios.post('/api/validate-key', {
            privateKey: sshPrivKey,
            publicKey: sshPubKey
          });

          console.log('Fingerprint Calculation Response:', response.data);

          if (response.data.valid) {
            onSubmit({ sshPrivKey, sshPubKey, keyType, fingerprint: response.data.fingerprint });
            setSSHPrivKey('');
            setSSHPubKey('');
            clearError();
            clearStatus();
          } else {
            setError('The private and public keys do not match.');
            setStatus('');
            clearError();
            clearStatus();
          }
        } catch (error) {
          console.error('Error handling form submission:', error);
          setError('Failed to submit SSH keys. Please try again.');
          setStatus('');
          clearError();
          clearStatus();
        }
      }
    }, 1000);
  };

  const isValidSSHKey = (key, type) => {
    let regex;
    if (type === 'private') {
      regex = /^-----BEGIN ((RSA|DSA|ECDSA|OPENSSH) )?PRIVATE KEY-----(.|\n|\r)*?-----END ((RSA|DSA|ECDSA|OPENSSH) )?PRIVATE KEY-----$/;
    } else {
      regex = /^ssh-(rsa|dss|ed25519|ecdsa-sha2-nistp(256|384|521))\s+[A-Za-z0-9+/=]+\s*(\S+\s*)?$/;
    }
    return regex.test(key.trim());
  };

  const isPassphraseProtected = (privKey) => {
    return privKey.includes('Proc-Type: 4,ENCRYPTED') && privKey.includes('DEK-Info');
  };

  const clearError = () => {
    setTimeout(() => setError(''), 3000);
  };

  const clearStatus = () => {
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="message-placeholder">
        {status && !error && <p className="status">{status}</p>}
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
