// server/auth/middleware.ts (v2)
import type { Request, Response, NextFunction } from 'express';
import { COOKIE_NAME, getSession, parseCookies, clearSessionCookie, type SessionData } from './session';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: SessionData & { sid: string };
    }
  }
}

/**
 * DEMO_MODE=true  (default): requests WITHOUT a session behave exactly as before
 *   (legacy x-user-role header, no route enforcement). Client-controlled: demo only.
 * DEMO_MODE=false: headers are ignored; every /api route needs a valid session and
 *   the right permission; legacy OTP/staff/patient login routes are disabled.
 * A valid session is ALWAYS enforced, in either mode.
 */
export const DEMO_MODE = process.env.DEMO_MODE !== 'false';

/** Reads the session cookie. A valid session always wins over any header. */
export function attachAuth(req: Request, res: Response, next: NextFunction) {
  const sid = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (sid) {
    const session = getSession(sid);
    if (session) req.auth = { ...session, sid };
    else clearSessionCookie(res); // expired or forged cookie
  }
  next();
}

/** Blocks cross-site state-changing requests that carry our session cookie. */
export function originCheck(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (!req.auth) return next();
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Forbidden' });
    } catch {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  next();
}
