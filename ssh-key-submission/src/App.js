import React, { useState, useEffect } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import SSHKeyList from './components/SSHKeyList';
import { downloadKeys } from './utils/download';

const App = () => {
  const [sshKeys, setSshKeys] = useState([]);

  useEffect(() => {
    fetch('https://your-backend-app.herokuapp.com/keys')
      .then((response) => response.json())
      .then((data) => setSshKeys(data.map((item) => item.key)));
  }, []);

  const handleFormSubmit = (key) => {
    fetch('https://your-backend-app.herokuapp.com/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    })
      .then((response) => response.json())
      .then((newKey) => setSshKeys([...sshKeys, newKey.key]));
  };

  const handleDownload = () => {
    downloadKeys(sshKeys);
  };

  return (
    <div>
      <h1>SSH Key Submission</h1>
      <SSHKeyForm onSubmit={handleFormSubmit} />
      <SSHKeyList sshKeys={sshKeys} />
      {sshKeys.length > 0 && (
        <button onClick={handleDownload}>Download Keys</button>
      )}
    </div>
  );
};

export default App;
