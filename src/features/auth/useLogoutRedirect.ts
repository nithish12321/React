import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LOGOUT_EVENT } from '@/app/listenerMiddleware';

/** Redirects to /login whenever the app forces a sign-out (expiry or failed refresh). */
export function useLogoutRedirect(): void {
  const navigate = useNavigate();
  useEffect(() => {
    const onLogout = () => navigate('/login', { replace: true });
    window.addEventListener(LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(LOGOUT_EVENT, onLogout);
  }, [navigate]);
}
