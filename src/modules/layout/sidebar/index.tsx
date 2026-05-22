import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/routes';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col bg-brand-50 rounded-r-lg m-4 shadow-md">
      <h1 className="text-2xl font-bold bg-brand shadow-brand text-white p-4 rounded-tr-lg">
        BancoXYZ
      </h1>
      <nav className={'flex flex-col gap-8 p-4'}>
        <Link
          to={routes.dashboard}
          className={[
            'text-lg font-bold rounded-lg p-2 hover:bg-brand-100',
            location.pathname === routes.dashboard && 'bg-brand-100',
          ].join(' ')}
        >
          Dashboard
        </Link>
        <Link
          to={routes.transactions.list}
          className={[
            'text-lg font-bold rounded-lg p-2 hover:bg-brand-100',
            location.pathname === routes.transactions.list && 'bg-brand-100',
          ].join(' ')}
        >
          Transactions
        </Link>
        <Link
          to={routes.logout}
          className={[
            'text-lg font-bold rounded-lg p-2 hover:bg-brand-100',
            location.pathname === routes.logout && 'bg-brand-100',
          ].join(' ')}
        >
          Logout
        </Link>
      </nav>
    </div>
  );
}
