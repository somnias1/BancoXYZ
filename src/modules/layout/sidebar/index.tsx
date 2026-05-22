import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/routes';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="flex flex-col bg-brand-50 rounded-r-lg m-4 shadow-md"
      aria-label="Sidebar"
    >
      <p className="text-2xl font-bold bg-brand shadow-brand text-white p-4 rounded-tr-lg" aria-hidden="true">
        BancoXYZ
      </p>
      <nav aria-label="Main navigation" className={'flex flex-col gap-8 p-4'}>
        <Link
          to={routes.dashboard}
          aria-current={location.pathname === routes.dashboard ? 'page' : undefined}
          className={[
            'text-lg font-bold rounded-lg p-2 hover:bg-brand-100',
            location.pathname === routes.dashboard && 'bg-brand-100',
          ].join(' ')}
        >
          Dashboard
        </Link>
        <Link
          to={routes.transactions.list}
          aria-current={location.pathname === routes.transactions.list ? 'page' : undefined}
          className={[
            'text-lg font-bold rounded-lg p-2 hover:bg-brand-100',
            location.pathname === routes.transactions.list && 'bg-brand-100',
          ].join(' ')}
        >
          Transactions
        </Link>
        <Link
          to={routes.logout}
          aria-current={location.pathname === routes.logout ? 'page' : undefined}
          className={[
            'text-lg font-bold rounded-lg p-2 hover:bg-brand-100',
            location.pathname === routes.logout && 'bg-brand-100',
          ].join(' ')}
        >
          Logout
        </Link>
      </nav>
    </aside>
  );
}
