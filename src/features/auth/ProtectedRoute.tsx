import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import type { RootState } from '@/app/store';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
