// server/auth/password.ts
// Password hashing with Node's built-in scrypt. Stored format: scrypt$<salt b64>$<hash b64>
import crypto from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(crypto.scrypt) as unknown as (
  pw: crypto.BinaryLike, salt: crypto.BinaryLike, keylen: number, opts: crypto.ScryptOptions,
) => Promise<Buffer>;

const PARAMS: crypto.ScryptOptions = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEYLEN = 64;
const PREFIX = 'scrypt$';

export const isHashed = (v: unknown): v is string => typeof v === 'string' && v.startsWith(PREFIX);

function parse(stored: string) {
  const [, s, h] = stored.split('$');
  return { salt: Buffer.from(s ?? '', 'base64'), hash: Buffer.from(h ?? '', 'base64') };
}

const format = (salt: Buffer, dk: Buffer) => `${PREFIX}${salt.toString('base64')}$${dk.toString('base64')}`;

export async function hashPassword(pw: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  return format(salt, await scryptAsync(pw, salt, KEYLEN, PARAMS));
}

export function hashPasswordSync(pw: string): string {
  const salt = crypto.randomBytes(16);
  return format(salt, crypto.scryptSync(pw, salt, KEYLEN, PARAMS));
}

function equal(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  if (!isHashed(stored)) return false;
  const { salt, hash } = parse(stored);
  return equal(await scryptAsync(pw, salt, hash.length || KEYLEN, PARAMS), hash);
}

export function verifyPasswordSync(pw: string, stored: string): boolean {
  if (!isHashed(stored)) return false;
  const { salt, hash } = parse(stored);
  return equal(crypto.scryptSync(pw, salt, hash.length || KEYLEN, PARAMS), hash);
}

/** Constant-time compare for the legacy plaintext values still in your DB. */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Burn the same CPU time when the account does not exist, so response time
// does not reveal which identifiers are registered.
const DUMMY = hashPasswordSync('labguard-timing-equaliser');
export async function burnVerify(pw: string): Promise<void> {
  await verifyPassword(pw, DUMMY);
}

/** Boot-time migration: hash every plaintext password in place. Returns how many changed. */
export function hashPlaintextPasswordsSync(users: Array<{ password?: string }>): number {
  let n = 0;
  for (const u of users) {
    if (typeof u.password === 'string' && u.password.length > 0 && !isHashed(u.password)) {
      u.password = hashPasswordSync(u.password);
      n++;
    }
  }
  return n;
}
