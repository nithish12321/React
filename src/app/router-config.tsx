import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';

const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const ShowcasePage = lazy(() => import('@/features/showcase/ShowcasePage'));

function AppShellRoute() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ShowcasePage />
      </AppShell>
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/app',
    element: <AppShellRoute />,
  },
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/app" replace />,
  },
]);
