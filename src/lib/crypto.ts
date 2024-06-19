/**
 * Load a 256-bit AES-GCM encryption/decryption key from a base64 encoded string
 *
 * @param source the encoded key
 * @param usage the purpose of the key
 * @returns the loaded key
 */
export async function loadKey(source?: string, usage: 'encryption' | 'signature' = 'encryption'): Promise<CryptoKey> {
  if (source === undefined) throw new Error('Source key is undefined');

  const bytes = Buffer.from(source, 'base64');

  switch (usage) {
    case 'encryption':
      return crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['encrypt', 'decrypt']);

    case 'signature':
      return crypto.subtle.importKey('raw', bytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

    default:
      throw new Error(`unknown key usage: ${usage}`);
  }
}

/**
 * Encrypt a piece of data using 256-bit AES-GCM
 *
 * @param key the key to encrypt with
 * @param plaintext the data to encrypt
 * @param encoding how to encode the result (default base64)
 * @returns the encrypted payload
 */
export async function encrypt(key: CryptoKey, plaintext: string, encoding: BufferEncoding = 'base64'): Promise<string> {
  const encoded = new TextEncoder().encode(plaintext);

  const iv = crypto.getRandomValues(new Uint8Array(16));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  return Buffer.from(ciphertext).toString(encoding) + ':' + Buffer.from(iv).toString(encoding);
}

/**
 * Decrypt a piece of data encrypted using 256-bit AES-GCM
 *
 * The payload must contain the ciphertext and initialization vector separated by a colon, with both encoded separately
 * in base64.
 *
 * @param key the key to decrypt with
 * @param payload the ciphertext and initialization vector
 * @param encoding how the payload is encoded (default base64)
 * @returns the plaintext
 */
export async function decrypt(key: CryptoKey, payload: string, encoding: BufferEncoding = 'base64'): Promise<string> {
  const [encodedCiphertext, encodedIv] = payload.split(':');
  const ciphertext = Buffer.from(encodedCiphertext, encoding);
  const iv = Uint8Array.from(Buffer.from(encodedIv, encoding));

  const encoded = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(encoded);
}

/**
 * Sign a piece of data
 *
 * @param key the key to sign with
 * @param data the data to sign
 * @param encoding how the signature should be encoded
 */
export async function sign(key: CryptoKey, data: string, encoding: BufferEncoding = 'base64'): Promise<string> {
  const encoded = new TextEncoder().encode(data);

  const signature = await crypto.subtle.sign('HMAC', key, encoded);
  return Buffer.from(signature).toString(encoding);
}

/**
 * Verify the signature of a piece of data
 *
 * @param key the key used to create the signature
 * @param data the data to verify
 * @param signature the signature to verify against
 * @param encoding how the signature was encoded
 */
export async function verify(
  key: CryptoKey,
  data: string,
  signature: string,
  encoding: BufferEncoding = 'base64',
): Promise<boolean> {
  const encoded = new TextEncoder().encode(data);

  const rawSignature = new Buffer(signature, encoding);
  return await crypto.subtle.verify('HMAC', key, rawSignature, encoded);
}
