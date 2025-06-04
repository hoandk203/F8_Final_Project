import { cookies } from 'next/headers';
import { AuthTokens, COOKIE_NAMES } from './cookies';

// Server-side cookie utilities (for middleware/server components)
export const serverCookies = {
  getAuthTokens: async (): Promise<AuthTokens | null> => {
    try {
      const cookieStore = await cookies();
      const access_token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
      const refresh_token = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
      const role = cookieStore.get(COOKIE_NAMES.USER_ROLE)?.value;

      if (!access_token || !refresh_token) return null;

      return {
        access_token,
        refresh_token,
        role,
      };
    } catch {
      return null;
    }
  },
}; 