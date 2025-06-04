export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  role?: string;
}

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ROLE: 'user_role',
} as const;

// Cookie options
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Client-side cookie utilities (for browser)
export const clientCookies = {
  set: (name: string, value: string, options: any = {}) => {
    const cookieOptions = {
      ...options,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    };
    
    const cookieString = Object.entries(cookieOptions)
      .reduce((acc, [key, val]) => {
        if (val === true) return `${acc}; ${key}`;
        if (val === false) return acc;
        return `${acc}; ${key}=${val}`;
      }, `${name}=${value}`);
    
    document.cookie = cookieString;
  },

  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },

  remove: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  setAuthTokens: (tokens: AuthTokens) => {
    clientCookies.set(COOKIE_NAMES.ACCESS_TOKEN, tokens.access_token, {
      maxAge: 60 * 60, // 1 hour
    });
    clientCookies.set(COOKIE_NAMES.REFRESH_TOKEN, tokens.refresh_token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    if (tokens.role) {
      clientCookies.set(COOKIE_NAMES.USER_ROLE, tokens.role, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
  },

  getAuthTokens: (): AuthTokens | null => {
    const access_token = clientCookies.get(COOKIE_NAMES.ACCESS_TOKEN);
    const refresh_token = clientCookies.get(COOKIE_NAMES.REFRESH_TOKEN);
    const role = clientCookies.get(COOKIE_NAMES.USER_ROLE);

    if (!access_token || !refresh_token) return null;

    return {
      access_token,
      refresh_token,
      role: role || undefined,
    };
  },

  clearAuthTokens: () => {
    clientCookies.remove(COOKIE_NAMES.ACCESS_TOKEN);
    clientCookies.remove(COOKIE_NAMES.REFRESH_TOKEN);
    clientCookies.remove(COOKIE_NAMES.USER_ROLE);
  },
}; 