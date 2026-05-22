import { Navigate } from 'react-router-dom';
import { routes } from '@/routes';
import { useCookies } from 'react-cookie';

export default function RouteProtector({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookies] = useCookies(['userToken']);
  const isAuthenticated = !!cookies.userToken;

  if (!isAuthenticated) {
    return <Navigate to={routes.login} />;
  }

  return <>{children}</>;
}
