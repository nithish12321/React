import { RouterProvider } from 'react-router';
import { router } from './router-config';

export function AppRouter() {
  return <RouterProvider router={router} />;
}
