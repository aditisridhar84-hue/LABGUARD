// server/auth/permissions.ts
// Single source of truth for role -> permission mapping (v2).
// Role ids match your users collection. DRAFT: review every line.

export type Role =
  | 'administrator'
  | 'lab_manager' // Laboratory Director
  | 'technician'
  | 'pathologist'
  | 'finance'
  | 'pharmacist'
  | 'patient';

export type Permission =
  | 'dashboard:read' | 'analytics:read'
  | 'patients:read' | 'patients:write' | 'patients:archive'
  | 'orders:read' | 'orders:write'
  | 'results:read' | 'results:write' | 'results:verify'
  | 'inventory:read' | 'inventory:write'
  | 'equipment:read' | 'equipment:write'
  | 'staff:read' | 'staff:write'
  | 'suppliers:read' | 'suppliers:write'
  | 'billing:read' | 'billing:write'
  | 'pharmacy:read' | 'pharmacy:write' | 'pharmacy:bills'
  | 'appointments:read' | 'appointments:write'
  | 'appointments:self' | 'doctors:read'
  | 'patients:self'
  | 'users:read' | 'users:manage'
  | 'audit:read'
  | 'integrations:manage'
  | 'ai:use'; // Copilot: aggregate operational data only

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  // Laboratory Director has all operational access except user administration.
  lab_manager: [
    'dashboard:read', 'analytics:read',
    'patients:read', 'patients:write', 'patients:archive',
    'orders:read', 'orders:write', 'results:read', 'results:write', 'results:verify',
    'inventory:read', 'inventory:write',
    'equipment:read', 'equipment:write',
    'staff:read', 'staff:write',
    'suppliers:read', 'suppliers:write',
    'billing:read', 'billing:write',
    'pharmacy:read', 'pharmacy:write', 'pharmacy:bills',
    'appointments:read', 'appointments:write', 'doctors:read',
    'audit:read', 'integrations:manage', 'ai:use',
  ],

  administrator: [
    'dashboard:read', 'analytics:read',
    'patients:read', 'patients:write', 'patients:archive',
    'orders:read', 'orders:write',
    'results:read', 'results:write', 'results:verify',
    'inventory:read', 'inventory:write', 'equipment:read', 'equipment:write',
    'staff:read', 'staff:write', 'suppliers:read', 'suppliers:write',
    'billing:read', 'billing:write',
    'pharmacy:read', 'pharmacy:write', 'pharmacy:bills',
    'appointments:read', 'appointments:write', 'doctors:read',
    'users:read', 'users:manage', 'audit:read', 'integrations:manage',
    'ai:use',
  ],

  technician: [
    'orders:read', 'orders:write',
    'results:read', 'results:write',
    'inventory:read',
    'equipment:read', 'equipment:write',
    'staff:read',
  ],

  pathologist: [
    'orders:read',
    'results:read', 'results:verify',
    'doctors:read',
  ],

  finance: [
    'billing:read', 'billing:write',
    'suppliers:read', 'suppliers:write',
    'inventory:read', 'pharmacy:bills',
  ],

  pharmacist: [
    'pharmacy:read', 'pharmacy:write',
    'patients:read', 'doctors:read', 'inventory:read',
  ],

  // Patient identity is bound to the session; no staff collection permissions.
  patient: [
    'patients:self', 'appointments:self',
  ],
};

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, value);
}

export function roleHas(role: unknown, permission: Permission): boolean {
  return isRole(role) && ROLE_PERMISSIONS[role].includes(permission);
}

export function permissionsFor(role: unknown): readonly Permission[] {
  return isRole(role) ? ROLE_PERMISSIONS[role] : [];
}
