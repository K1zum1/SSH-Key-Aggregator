## Compromise Vault:  
### A web application designed to securely aggregate and manage known compromised SSH keys, providing system administrators with a centralized repository to enhance security measures and prevent unauthorized access.
![SSH Key Submission](ssh-key-submission/ssh.jpg)


## Table of Contents

- [Description](#description)
- [Limitations](#limitations)
- [Redeployment](#redeployment)
  - [Clone the Repository](#clone-the-repository)
  - [Install Project Dependencies](#install-project-dependencies)
  - [Create a .env File](#Create-a-.env-file-in-the-project-root)
  - [Add PostgreSQL Connection Details](#add-postgresql-connection-details)
- [Database Schema](#database-schema)
  - [Table: SSHKeys](#table-sshkeys)
  - [Description of Columns](#description-of-columns)
  - [Table Creation Script](#table-creation-script)
- [Build and Deploy](#build-and-deploy)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Description

Compromise Vault is a web application designed to manage the submission and tracking of SSH keys. It allows users to submit SSH private and public keys, ensures their validity, and stores them securely in a database. This project is useful for administrators and developers who are looking to generate key revocation lists in order to blacklist these compromised keys. 

## Limitations

Currently as of now there are a few known limitations
- **Limited Database Size**
- **Only checks for RSA fingerprints. Does not check other types**
- **Does not generate a .krl file, only gives JSON data of the public keys**

All of these issues are being worked on currently.

## Redeployment
 
### Clone the repository 

```bash
https://github.com/K1zum1/Compromise-Vault
cd Compromise-Vault
```
## Install Project Dependancies
```bash
npm install
```

## Create a .env file in the project root
```bash
touch .env
```

## Add PostgreSQL Connection Details
```
POSTGRES_URL=postgres://ssh_user:your_password@localhost:5432/SSH-Key-Aggregator
```

## Database Schema



| Column Name          | Data Type                   | Max Length | Default           | Nullable |
|----------------------|-----------------------------|------------|-------------------|----------|
| privKey              | text                        | -          | null              | YES      |
| pubKey               | text                        | -          | null              | YES      |
| keyType              | character varying           | 255        | null              | YES      |
| ipAddress            | character varying           | 255        | null              | YES      |
| userAgent            | text                        | -          | null              | YES      |
| submissionDate       | timestamp without time zone | -          | CURRENT_TIMESTAMP | YES      |
| referer              | text                        | -          | null              | YES      |
| fingerprintValidated | character varying           | 3          | null              | YES      |


## Description of Columns:

- **privKey**: The SSH private key provided by the user.
- **pubKey**: The SSH public key provided by the user.
- **keyType**: The type of SSH key (e.g., RSA, DSA, ECDSA).
- **ipAddress**: The IP address of the user submitting the SSH keys.
- **userAgent**: The user agent string from the user's browser or application.
- **submissionDate**: The date and time when the SSH keys were submitted. Default is the current timestamp.
- **referer**: The referer URL from where the submission was made.
- **fingerprintValidated**: Indicates whether the fingerprint of the SSH key was validated.


### Table Creation Script:

```sql
CREATE TABLE SSHKeys (
    id SERIAL PRIMARY KEY,
    privKey TEXT,
    pubKey TEXT,
    keyType VARCHAR(255),
    ipAddress VARCHAR(255),
    userAgent TEXT,
    submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referer TEXT,
    fingerprintValidated VARCHAR(3)
);
```

## Build and Deploy


```bash
npm run build
npm start
```

```bash
vercel dev
```
## Usage
To use the application:

Navigate to the deployed application URL.

Fill in the required fields with your SSH private and public keys.

Submit the form to validate and store the keys in the database.

## Contributing
Contributions are welcome! 

Please fork the repository and submit a pull request with your changes. 

Ensure that your code adheres to the project's coding standards and passes all tests.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact Information
For issues or questions, please open an issue in this repository.






