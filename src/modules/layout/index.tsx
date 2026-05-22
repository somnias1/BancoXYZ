import Sidebar from './sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  // TODO: Add routes, navigation and session logic
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </main>
  );
}
