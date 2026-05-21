export default function Layout({ children }: { children: React.ReactNode }) {
    // TODO: Add routes, navigation and session logic
  return (
    <main className="flex flex-col min-h-screen">
      {children}
    </main>
  );
}