import React, { useState } from 'react';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit }) => {
  const [sshKey, setSshKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sshKey.trim()) {
      onSubmit(sshKey);
      setSshKey('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={sshKey}
        onChange={(e) => setSshKey(e.target.value)}
        placeholder="Enter your compromised SSH key"
        rows="4"
        cols="50"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SSHKeyForm;
