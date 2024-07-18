import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import forge from 'node-forge';

const isValidSSHPrivateKey = (key: string | undefined): { valid: boolean, error?: string } => {
  if (!key) {
    return { valid: false, error: 'SSH private key is missing.' };
  }

  const privateKeyPattern = /^-----BEGIN ((EC|PGP|DSA|RSA|ECDSA|OPENSSH) )?PRIVATE KEY-----(.|\n|\r)*?-----END ((EC|PGP|DSA|RSA|ECDSA|OPENSSH) )?PRIVATE KEY-----$/;
  if (!privateKeyPattern.test(key.trim())) {
    return { valid: false, error: 'Invalid SSH private key format.' };
  }

  const isPassphraseProtected = key.includes('Proc-Type: 4,ENCRYPTED') && key.includes('DEK-Info');
  if (isPassphraseProtected) {
    return { valid: false, error: 'SSH private key is password-protected.' };
  }

  return { valid: true };
};

const isValidSSHPublicKey = (key: string | undefined): { valid: boolean, error?: string } => {
  if (!key) {
    return { valid: false, error: 'SSH public key is missing.' };
  }

  const publicKeyPattern = /^ssh-(rsa|dss|ecdsa-sha2-nistp(256|384|521)|ed25519)\s+[A-Za-z0-9+/=]+\s*(\S+\s*)?$/;

  if (!publicKeyPattern.test(key.trim())) {
    return { valid: false, error: 'Invalid SSH public key format.' };
  }

  return { valid: true };
};

const calculateSSHPublicKeyFingerprint = (pubKey: string): string | null => {
  try {
    const keyParts = pubKey.trim().split(' ');
    if (keyParts.length < 2) return null;

    const keyData = Buffer.from(keyParts[1], 'base64');

    const hash = crypto.createHash('md5');
    hash.update(keyData);
    const digest = hash.digest('hex');
    const fingerprint = digest.match(/.{2}/g)?.join(':') ?? null;

    console.log(`Calculated fingerprint: ${fingerprint}`);

    return fingerprint;
  } catch (error) {
    console.error('Error calculating fingerprint:', error);
    return null;
  }
};

const extractPublicKeyFromPrivateKey = (privateKey: string): string | null => {
  try {
    const privateKeyObject = forge.pki.privateKeyFromPem(privateKey);
    const publicKeyObject = forge.pki.setRsaPublicKey(privateKeyObject.n, privateKeyObject.e);
    const sshPublicKey = forge.ssh.publicKeyToOpenSSH(publicKeyObject);
    return sshPublicKey;
  } catch (error) {
    console.error('Error extracting public key from private key:', error);
    return null;
  }
};

export default async function validateKey(req: VercelRequest, res: VercelResponse) {
  const { privateKey, publicKey } = req.body;

  if (!privateKey || !publicKey) {
    return res.status(400).json({ error: 'Both privateKey and publicKey must be provided.' });
  }

  const privateKeyValidation = isValidSSHPrivateKey(privateKey);
  const publicKeyValidation = isValidSSHPublicKey(publicKey);

  if (!privateKeyValidation.valid) {
    return res.status(400).json({ error: privateKeyValidation.error });
  }
  if (!publicKeyValidation.valid) {
    return res.status(400).json({ error: publicKeyValidation.error });
  }

  if (privateKey.includes('RSA PRIVATE KEY')) {
    const extractedPublicKey = extractPublicKeyFromPrivateKey(privateKey);
    if (!extractedPublicKey) {
      return res.status(500).json({ error: 'Failed to extract public key from private key.' });
    }

    const extractedFingerprint = calculateSSHPublicKeyFingerprint(extractedPublicKey);
    const providedFingerprint = calculateSSHPublicKeyFingerprint(publicKey);

    if (!extractedFingerprint || !providedFingerprint) {
      return res.status(500).json({ error: 'Failed to calculate fingerprints.' });
    }

    const isValid = extractedFingerprint === providedFingerprint;
    return res.status(200).json({ valid: isValid, fingerprint: providedFingerprint, fingerprintValidated: 'yes' });
  } else {
    return res.status(200).json({ valid: true, fingerprintValidated: 'no' });
  }
}
