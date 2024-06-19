import { decrypt, encrypt, loadKey } from '@/lib/crypto';

async function loadEncryptionKey(): Promise<CryptoKey> {
  try {
    return loadKey(process.env.SSR_ONLY_KEY);
  } catch {
    throw new Error('Missing environment variable SSR_ONLY_KEY');
  }
}

/**
 * Cloak a value to only be accessible during server-side rendering
 */
export async function cloakSsrOnly(secret: string | undefined): Promise<string | undefined> {
  if (secret === undefined) return undefined;

  const key = await loadEncryptionKey();
  return encrypt(key, secret);
}

/**
 * Uncloak a value that can only be accessed during server-side rendering
 */
export async function uncloakSsrOnly(secret: string | undefined): Promise<string | undefined> {
  if (typeof window !== 'undefined' || secret === undefined) return undefined;

  const key = await loadEncryptionKey();
  return decrypt(key, secret);
}
