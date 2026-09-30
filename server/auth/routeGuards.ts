// server/auth/routeGuards.ts
// One table that maps every /api route in server.ts to the permission it needs.
// Mount it BEFORE the route handlers:  app.use('/api', apiGuard)
// Paths are relative to the /api mount (no "/api" prefix). First matching rule wins.
// Any /api route missing from this table is DENIED when enforcement is on.

import type { Request, Response, NextFunction } from 'express';
import { roleHas, type Permission } from './permissions';
import { DEMO_MODE } from './middleware';

type Guard = Permission | 'public' | 'authenticated' | 'legacy-login' | 'patient:self' | 'appointments:self' | 'pharmacy:bills' | 'staff:session';
type Rule = readonly [method: string, path: RegExp, guard: Guard];

export const RULES: readonly Rule[] = [
  // ---- auth ----
  ['POST', /^\/auth\/login\/(administrator|lab_manager|technician|pathologist|finance|pharmacist|patient|laboratory-director|senior-lab-technician|clinical-pathologist|finance-controller|registered-pharmacist|verified-patient)$/, 'public'],
  ['GET',  /^\/auth\/session$/, 'public'],
  ['POST', /^\/auth\/logout$/, 'public'],
  ['GET',  /^\/auth\/me$/, 'public'], // handler returns 401 itself when DEMO_MODE=false
  ['GET',  /^\/auth\/users$/, 'users:read'],
  ['PUT',  /^\/auth\/profile$/, 'authenticated'],
  ['POST', /^\/auth\/(send-otp|verify-otp|staff-login|patient-login)$/, 'legacy-login'],

  // ---- operations ----
  ['GET',  /^\/dashboard$/, 'dashboard:read'],
  ['GET',  /^\/(analytics|risks|recommendations)$/, 'analytics:read'],
  ['POST', /^\/recommendations\/[^/]+\/execute$/, 'inventory:write'],
  ['POST', /^\/simulator$/, 'analytics:read'],
  ['GET',  /^\/trace\/[^/]+$/, 'analytics:read'],

  // ---- patients ----
  ['GET',    /^\/patients$/, 'patients:read'],
  ['POST',   /^\/patients$/, 'patients:write'],
  ['PUT',    /^\/patients\/[^/]+$/, 'patients:write'],
  ['DELETE', /^\/patients\/[^/]+$/, 'patients:archive'],
  ['GET',    /^\/patient\/my-record$/, 'patient:self'],

  // ---- orders / results ----
  ['GET',   /^\/test-orders$/, 'orders:read'],
  ['*',     /^\/test-orders(\/.*)?$/, 'orders:write'],
  ['GET',   /^\/test-results$/, 'results:read'],
  ['PATCH', /^\/test-results\/[^/]+\/verify$/, 'results:verify'],
  ['*',     /^\/test-results(\/.*)?$/, 'results:write'],

  // ---- inventory / equipment / staff / suppliers / billing ----
  ['GET', /^\/inventory(\/transactions)?$/, 'inventory:read'],
  ['*',   /^\/inventory(\/.*)?$/, 'inventory:write'],
  ['GET', /^\/equipment$/, 'equipment:read'],
  ['*',   /^\/equipment(\/.*)?$/, 'equipment:write'],
  ['GET', /^\/staff$/, 'staff:read'],
  ['*',   /^\/staff(\/.*)?$/, 'staff:write'],
  ['GET', /^\/suppliers$/, 'suppliers:read'],
  ['*',   /^\/suppliers(\/.*)?$/, 'suppliers:write'],
  ['GET', /^\/billing$/, 'billing:read'],
  ['*',   /^\/billing(\/.*)?$/, 'billing:write'],

  // ---- clinical ----
  ['GET', /^\/doctors$/, 'doctors:read'],
  ['GET', /^\/appointments$/, 'appointments:self'],
  ['POST', /^\/appointments$/, 'appointments:self'],
  ['*',   /^\/(doctors|appointments)(\/.*)?$/, 'appointments:write'],
  ['GET', /^\/pharmacy\/bills$/, 'pharmacy:bills'],
  ['GET', /^\/pharmacy\/.+$/, 'pharmacy:read'],
  ['*',   /^\/pharmacy\/.+$/, 'pharmacy:write'],

  // ---- governance / integrations ----
  ['GET', /^\/audit$/, 'audit:read'],
  ['*',   /^\/(integrations|sync)(\/.*)?$/, 'integrations:manage'],

  // ---- shared ----
  ['*',   /^\/notifications(\/.*)?$/, 'staff:session'],
  ['GET', /^\/health$/, 'dashboard:read'],
  ['GET', /^\/telemetry\/mode$/, 'integrations:manage'],
  ['POST', /^\/telemetry\/mode$/, 'integrations:manage'],
  ['GET', /^\/telemetry\/stream$/, 'dashboard:read'], // streams full mutation records

  // ---- Gemini ----
  ['POST', /^\/copilot$/, 'ai:use'],
];

function findRule(method: string, path: string): Rule | undefined {
  const m = method === 'HEAD' ? 'GET' : method;
  return RULES.find(([rm, re]) => (rm === '*' || rm === m) && re.test(path));
}

export function makeGuard(demoMode: boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    const enforce = !!req.auth || !demoMode;
    if (!enforce) return next(); // legacy demo behaviour, unchanged

    const rule = findRule(req.method, req.path);
    if (!rule) return res.status(403).json({ error: 'Forbidden' }); // default deny
    const guard = rule[2];

    if (guard === 'public') return next();
    if (guard === 'legacy-login') {
      // Only reachable when enforcing: demo login flows are switched off.
      return res.status(410).json({ error: 'This sign-in method is disabled. Use your role\'s sign-in page.' });
    }
    if (!req.auth) return res.status(401).json({ error: 'Authentication required' });
    if (guard === 'patient:self') {
      if (req.auth.role !== 'patient' || !req.auth.patientId || !roleHas(req.auth.role, 'patients:self')) {
        return res.status(403).json({ error: 'Patient self-service access required' });
      }
      return next();
    }
    if (guard === 'appointments:self') {
      if (req.auth.role === 'patient' && req.auth.patientId && roleHas(req.auth.role, 'appointments:self')) return next();
      if (roleHas(req.auth.role, 'appointments:read') || roleHas(req.auth.role, 'appointments:write')) return next();
      return res.status(403).json({ error: 'You do not have permission to access these appointments' });
    }
    if (guard === 'pharmacy:bills') {
      if (!roleHas(req.auth.role, 'pharmacy:bills') && !roleHas(req.auth.role, 'pharmacy:read')) {
        return res.status(403).json({ error: 'You do not have permission to view pharmacy bills' });
      }
      return next();
    }
    if (guard === 'staff:session') {
      if (req.auth.role === 'patient') return res.status(403).json({ error: 'Patient accounts cannot access staff notifications' });
      return next();
    }
    if (guard === 'authenticated') return next();
    if (!roleHas(req.auth.role, guard)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    next();
  };
}

export const apiGuard = makeGuard(false);
