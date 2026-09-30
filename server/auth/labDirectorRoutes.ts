// server/auth/labDirectorRoutes.ts (v2)
import type { Express, Request, Response } from 'express';
import { z } from 'zod';
import {
  COOKIE_NAME, createSession, destroySession, parseCookies,
  setSessionCookie, clearSessionCookie,
  checkRateLimit, recordFailure, clearFailures,
} from './session';
import { hashPassword, isHashed, verifyPassword, safeEqual, burnVerify } from './password';
import { permissionsFor } from './permissions';

const ROLE_LOGIN_ROUTES = [
  ['laboratory-director', 'lab_manager'],
  ['administrator', 'administrator'],
  ['senior-lab-technician', 'technician'],
  ['clinical-pathologist', 'pathologist'],
  ['finance-controller', 'finance'],
  ['registered-pharmacist', 'pharmacist'],
  ['verified-patient', 'patient'],
] as const;

const loginSchema = z.object({
  identifier: z.string().trim().min(3).max(120),
  password: z.string().min(1).max(200),
});

// One message for every failure: wrong password, unknown account, inactive, wrong role.
const GENERIC_FAIL = 'Sign-in failed. Check your details, or use the portal for your own role.';

// Never log the raw identifier (may be an email).
const mask = (s: string) => (s.length <= 2 ? '**' : `${s.slice(0, 2)}***`);

export function registerLabDirectorAuth(app: Express, dbEngine: any) {
  const audit = (entry: Record<string, unknown>) => {
    try { dbEngine.logAudit({ dataset: 'Auth', ...entry }); } catch { /* never break login */ }
  };

  for (const [slug, expectedRole] of ROLE_LOGIN_ROUTES) {
    app.post(`/api/auth/login/${slug}`, async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Enter your email or employee ID and your password.' });
    }
    const { identifier, password } = parsed.data;

    const ip = req.ip || 'unknown';
    const ipKey = `ip:${ip}`;
    const idKey = `id:${ip}:${identifier.toLowerCase()}`;

    const blocked = [checkRateLimit(idKey, 5), checkRateLimit(ipKey, 20)].find((g) => !g.ok);
    if (blocked) {
      res.setHeader('Retry-After', String(blocked.retryAfterSec));
      return res.status(429).json({
        error: 'Too many sign-in attempts. Try again later.',
        retryAfterSeconds: blocked.retryAfterSec,
      });
    }

    const fail = (action: string, details: string) => {
      recordFailure(idKey, 5);
      recordFailure(ipKey, 20);
      audit({
        userId: 'anonymous', user: 'anonymous', role: 'unknown',
        action, recordAffected: mask(identifier), details,
      });
      return res.status(401).json({ error: GENERIC_FAIL });
    };

    try {
      // Own credential check: does NOT call dbEngine.authenticateStaff, so a rejected
      // attempt never updates lastLogin or writes a "login succeeded" audit entry.
      const clean = identifier.toLowerCase();
      const users: any[] = dbEngine.getCollection('users');
      const user = users.find((u) => u.role === expectedRole && [u.email, u.employeeId, u.patientId, u.uhid]
        .some((value) => typeof value === 'string' && value.toLowerCase() === clean));

      let passwordOk = false;
      if (!user || !user.password) {
        await burnVerify(password); // equalise timing; passwordless accounts never sign in
      } else if (isHashed(user.password)) {
        passwordOk = await verifyPassword(password, user.password);
      } else {
        passwordOk = safeEqual(password, user.password); // legacy plaintext
        if (passwordOk) { user.password = await hashPassword(password); dbEngine.scheduleSave(); }
      }

      if (!user || !passwordOk) return fail('LOGIN_FAILED', 'Invalid credentials');

      const active = !user.status || String(user.status).toLowerCase() === 'active';
      if (!active) return fail('LOGIN_INACTIVE', `Sign-in refused: account status ${user.status}`);

      if (user.role !== expectedRole) {
        return fail('LOGIN_ROLE_MISMATCH', `Valid credentials used on Laboratory Director portal; role ${user.role}`);
      }

      // Session-fixation defence: drop any session already attached to this browser.
      const oldSid = parseCookies(req.headers.cookie)[COOKIE_NAME];
      if (oldSid) destroySession(oldSid);

      const sid = createSession({
        userId: user.id, name: user.name, role: user.role,
        department: user.department, language: user.language || 'en',
        patientId: user.patientId || user.uhid,
        email: user.email,
        phone: user.phone,
        photoUrl: user.photoUrl,
        employeeId: user.employeeId,
      });
      setSessionCookie(res, sid);
      clearFailures(idKey);

      user.lastLogin = new Date().toISOString();
      dbEngine.scheduleSave();
      audit({
        userId: user.id, user: user.name, role: user.role,
        action: 'LOGIN', recordAffected: user.id,
        details: 'Laboratory Director portal sign-in',
      });

      // Role comes from the server-side record, never from the request.
      res.json({
        success: true,
        user: {
          id: user.id, name: user.name, role: user.role,
          department: user.department, language: user.language || 'en',
        },
        redirectTo: '/',
      });
    } catch {
      res.status(500).json({ error: 'Sign-in is temporarily unavailable.' });
    }
    });
  }

  // Session check for the SPA. Cookie only; ignores legacy headers.
  app.get('/api/auth/session', (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ authenticated: false });
    const { sid: _sid, userId, ...sessionUser } = req.auth;
    res.json({
      authenticated: true,
      user: { ...sessionUser, id: userId },
      permissions: permissionsFor(req.auth.role),
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    if (req.auth) {
      destroySession(req.auth.sid); // server-side invalidation, not just cookie removal
      audit({
        userId: req.auth.userId, user: req.auth.name, role: req.auth.role,
        action: 'LOGOUT', recordAffected: req.auth.userId, details: 'Session ended',
      });
    }
    clearSessionCookie(res);
    res.json({ success: true });
  });
}
