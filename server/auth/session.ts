// server/auth/session.ts
// Server-side sessions. The browser only holds a random, opaque, HttpOnly cookie.
// Only a SHA-256 hash of the session id is kept in memory.
//
// LIMITATION: the store is in-memory. Sessions are lost on restart/redeploy and
// do not work across multiple instances. Swap the Map for Redis/DB if you scale out.

import crypto from 'crypto';
import type { Response } from 'express';
import type { Role } from './permissions';

export const IS_PROD = process.env.NODE_ENV === 'production';
// "__Host-" prefix: browser enforces Secure + Path=/ + no Domain (production only).
export const COOKIE_NAME = IS_PROD ? '__Host-lg_sid' : 'lg_sid';

const ABSOLUTE_MS = 8 * 60 * 60 * 1000; // hard cap: 8 hours
const IDLE_MS = (Number(process.env.SESSION_IDLE_MINUTES) || 30) * 60 * 1000;

export interface SessionData {
  userId: string;
  name: string;
  role: Role;
  department?: string;
  language?: string;
  patientId?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  employeeId?: string;
}

interface StoredSession extends SessionData {
  createdAt: number;
  lastSeen: number;
}

const sessions = new Map<string, StoredSession>();
const hash = (sid: string) => crypto.createHash('sha256').update(sid).digest('hex');

export function createSession(data: SessionData): string {
  const sid = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  sessions.set(hash(sid), { ...data, createdAt: now, lastSeen: now });
  return sid;
}

export function getSession(sid: string): SessionData | null {
  const key = hash(sid);
  const s = sessions.get(key);
  if (!s) return null;
  const now = Date.now();
  if (now - s.createdAt > ABSOLUTE_MS || now - s.lastSeen > IDLE_MS) {
    sessions.delete(key);
    return null;
  }
  s.lastSeen = now;
  const { createdAt: _c, lastSeen: _l, ...data } = s;
  return data;
}

export function destroySession(sid: string): void {
  sessions.delete(hash(sid));
}

/** Call on password change / role change / account disable. */
export function destroyUserSessions(userId: string): void {
  for (const [k, s] of sessions) if (s.userId === userId) sessions.delete(k);
}

setInterval(() => {
  const now = Date.now();
  for (const [k, s] of sessions) {
    if (now - s.createdAt > ABSOLUTE_MS || now - s.lastSeen > IDLE_MS) sessions.delete(k);
  }
}, 5 * 60 * 1000).unref();

// ---------- cookies ----------

export function parseCookies(header?: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function setSessionCookie(res: Response, sid: string): void {
  const attrs = [
    `${COOKIE_NAME}=${sid}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(ABSOLUTE_MS / 1000)}`,
  ];
  if (IS_PROD) attrs.push('Secure');
  res.append('Set-Cookie', attrs.join('; '));
}

export function clearSessionCookie(res: Response): void {
  const attrs = [`${COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (IS_PROD) attrs.push('Secure');
  res.append('Set-Cookie', attrs.join('; '));
}

// ---------- login rate limiting ----------

interface Bucket { count: number; windowStart: number; lockedUntil: number }
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

export function checkRateLimit(key: string, max: number): { ok: boolean; retryAfterSec: number } {
  const b = buckets.get(key);
  const now = Date.now();
  if (b && b.lockedUntil > now) {
    return { ok: false, retryAfterSec: Math.ceil((b.lockedUntil - now) / 1000) };
  }
  if (b && now - b.windowStart > WINDOW_MS) buckets.delete(key);
  return { ok: true, retryAfterSec: 0 };
}

export function recordFailure(key: string, max: number): void {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now, lockedUntil: 0 });
    return;
  }
  b.count += 1;
  if (b.count >= max) b.lockedUntil = now + LOCK_MS;
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}

setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.lockedUntil < now && now - b.windowStart > WINDOW_MS) buckets.delete(k);
  }
}, 10 * 60 * 1000).unref();
