import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AuthUser, UserRole, Patient } from '../types';

export interface AuthContextType {
  currentUser: AuthUser | null;
  effectiveRole: UserRole;
  previewRole: UserRole | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isPatient: boolean;
  patientRecord: Patient | null;
  profileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  loginStaff: (emailOrEmployeeId: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginPatient: (uhid: string, phone: string, otp?: string) => Promise<{ success: boolean; error?: string }>;
  sendOTP: (identifier: string, userType: 'staff' | 'patient') => Promise<{ success: boolean; cooldownSeconds?: number; error?: string; message?: string; mode?: string }>;
  verifyOTP: (identifier: string, otp: string, userType: 'staff' | 'patient') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  switchRole: (role: UserRole) => void;
  switchPreviewRole: (role: UserRole | null) => void;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_ROLES: UserRole[] = [
  'administrator',
  'lab_manager',
  'technician',
  'pathologist',
  'finance',
  'pharmacist',
  'patient'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);
  const [patientRecord, setPatientRecord] = useState<Patient | null>(null);

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then(async (res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!active || !data?.authenticated || !data.user) return;
        const user = data.user;
        setCurrentUser({
          id: user.id || user.userId,
          name: user.name,
          email: user.email || '',
          role: user.role,
          department: user.department || '',
          phone: user.phone,
          patientId: user.patientId,
          language: user.language || 'en',
          permissions: Array.isArray(data.permissions) ? data.permissions : [],
        });
      })
      .catch(() => setCurrentUser(null))
      .finally(() => { if (active) setIsAuthLoading(false); });
    return () => { active = false; };
  }, []);

  // Derive single authoritative role with fallback
  const effectiveRole: UserRole = useMemo(() => {
    const candidate = currentUser?.role;
    if (candidate && VALID_ROLES.includes(candidate)) {
      return candidate;
    }
    return 'lab_manager';
  }, [previewRole, currentUser]);

  const isPatient: boolean = effectiveRole === 'patient';
  const isAuthenticated: boolean = currentUser !== null;

  const switchRole = (newRole: UserRole) => {
    void newRole;
  };

  const switchPreviewRole = (role: UserRole | null) => {
    void role;
    setPreviewRole(null);
  };

  const loginStaff = async (emailOrEmployeeId: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsAuthLoading(true);
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrEmployeeId, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setCurrentUser(data.user);
      setPreviewRole(null);
      setLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginPatient = async (uhid: string, phone: string, otp?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsAuthLoading(true);
      const res = await fetch('/api/auth/patient-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uhid, phone, otp })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Patient lookup failed' };
      }

      setCurrentUser(data.user);
      setPatientRecord(data.patient || null);
      setPreviewRole('patient');
      setLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const sendOTP = async (identifier: string, userType: 'staff' | 'patient'): Promise<{ success: boolean; cooldownSeconds?: number; error?: string; message?: string; mode?: string }> => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, userType })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to dispatch OTP', cooldownSeconds: data.cooldownSeconds || 0 };
      }
      return { success: true, cooldownSeconds: data.cooldownSeconds || 30, message: data.message, mode: data.mode };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while requesting OTP' };
    }
  };

  const verifyOTP = async (identifier: string, otp: string, userType: 'staff' | 'patient'): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsAuthLoading(true);
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, userType })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed' };
      }

      setCurrentUser(data.user);
      if (userType === 'patient') {
        setPatientRecord(data.patient || null);
        setPreviewRole('patient');
      } else {
        setPreviewRole(null);
      }
      setLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification connection error' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    void fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    setCurrentUser(null);
    setPatientRecord(null);
    setPreviewRole(null);
    setLoginModalOpen(true);
  };

  const updateProfile = async (updates: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Not logged in' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          userId: currentUser.id,
          ...updates
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      setCurrentUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        effectiveRole,
        previewRole,
        isAuthenticated,
        isAuthLoading,
        isPatient,
        patientRecord,
        profileModalOpen,
        openProfileModal: () => setProfileModalOpen(true),
        closeProfileModal: () => setProfileModalOpen(false),
        loginStaff,
        loginPatient,
        sendOTP,
        verifyOTP,
        logout,
        updateProfile,
        switchRole,
        switchPreviewRole,
        loginModalOpen,
        openLoginModal: () => setLoginModalOpen(true),
        closeLoginModal: () => setLoginModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
