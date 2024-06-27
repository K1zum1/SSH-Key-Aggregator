import React from 'react';
import '../style/SSHKeyList.css';

const SSHKeyList = ({ sshKeys }) => {
  return (
    <div>
      <h2>Submitted SSH Keys</h2>
      <ul>
        {sshKeys.map((key, index) => (
          <li key={index}>
            <p><strong>SSH Private Key:</strong> {key.sshPrivKey}</p>
            <p><strong>SSH Public Key:</strong> {key.sshPubKey}</p>
            <p><strong>Key Type:</strong> {key.KeyType}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SSHKeyList;
