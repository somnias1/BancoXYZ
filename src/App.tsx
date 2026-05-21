import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { routes } from './routes';
import Dashboard from './modules/dashboard';
import Login from './modules/auth/login';
import TransactionsList from './modules/transactions/list';
import TransactionsConfiguration from './modules/transactions/configuration';
import Logout from './modules/auth/logout';
import RouteProtector from './modules/auth/routeProtector';
import Layout from './modules/layout';

function ProtectedShell() {
  return (
    <RouteProtector>
      <Layout>
        <Outlet />
      </Layout>
    </RouteProtector>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.logout} element={<Logout />} />
        <Route element={<ProtectedShell />}>
          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.transactions.list} element={<TransactionsList />} />
          <Route path={routes.transactions.create} element={<TransactionsConfiguration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
