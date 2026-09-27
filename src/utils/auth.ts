export const CREATOR_MASTER_PASSWORD = 'parhoon';
export const DEFAULT_ADMIN_PASSWORD = 'admin';

const STORAGE_KEYS = {
  ADMIN_PASSWORD: 'parhoon_admin_password_v1',
  AUTH_SESSION: 'parhoon_admin_authenticated_v1'
};

export const getStoredAdminPassword = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, DEFAULT_ADMIN_PASSWORD);
      return DEFAULT_ADMIN_PASSWORD;
    }
    return saved;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
};

export const setStoredAdminPassword = (newPassword: string): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
};

export const checkAdminPassword = (inputPassword: string): { success: boolean; isMaster: boolean } => {
  const trimmed = inputPassword.trim();
  // Check master creator password first
  if (trimmed === CREATOR_MASTER_PASSWORD) {
    return { success: true, isMaster: true };
  }
  // Check custom/stored admin password
  const currentPassword = getStoredAdminPassword();
  if (trimmed === currentPassword) {
    return { success: true, isMaster: false };
  }
  return { success: false, isMaster: false };
};

export const getIsAdminAuthenticated = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuthenticatedSession = (authenticated: boolean): void => {
  try {
    if (authenticated) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  } catch {
    // ignore
  }
};
