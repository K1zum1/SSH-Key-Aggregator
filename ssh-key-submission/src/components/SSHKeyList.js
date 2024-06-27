import React from 'react';
import '../style/SSHKeyList.css';

const SSHKeyList = ({ sshKeys }) => {
  return (
    <div>
      <h2>Submitted SSH Keys</h2>
      <ul>
        {sshKeys.map((key, index) => (
          <li key={index}>
            <p><strong>SSH Key:</strong> {key.sshKey}</p>
            <p><strong>Username:</strong> {key.username}</p>
            <p><strong>Key Type:</strong> {key.KeyType}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SSHKeyList;
