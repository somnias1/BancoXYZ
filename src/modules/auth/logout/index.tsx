import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { Button } from '@/components/button';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes';

export default function Logout() {
  const [, , removeCookie] = useCookies(['userToken']);
  const navigate = useNavigate();
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only should run once
  useEffect(() => {
    removeCookie('userToken');
  }, []);
  return (
    <main
      className="flex flex-col gap-4 items-center justify-center h-screen"
      aria-labelledby="logout-heading"
    >
      <img
        src="https://www.topazevolution.com/hubfs/Topaz%20One%20Logo.svg"
        alt="BancoXYZ logo"
        className="w-1/2 pb-8"
      />
      <h1 id="logout-heading" className="text-2xl font-bold">Logout</h1>
      <p className="text-sm text-gray-500" role="status" aria-live="polite">
        You have been logged out.
      </p>
      <Button
        variant="primary"
        onClick={() => navigate(routes.login)}
        data-testid="login-button"
        aria-label="Go to login page"
      >
        Login
      </Button>
    </main>
  );
}
