import React, { useState, useEffect } from 'react';
import SSHKeyForm from './components/SSHKeyForm';
import SSHKeyList from './components/SSHKeyList';
import { downloadKeys } from './utils/download';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';

const App = () => {
  const [sshKeys, setSshKeys] = useState([]);

  useEffect(() => {
    const storedKeys = loadFromLocalStorage();
    setSshKeys(storedKeys);
  }, []);

  useEffect(() => {
    saveToLocalStorage(sshKeys);
  }, [sshKeys]);

  const handleFormSubmit = (key) => {
    setSshKeys([...sshKeys, key]);
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
