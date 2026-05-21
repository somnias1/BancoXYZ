import { Navigate } from "react-router-dom";
import { routes } from "@/routes";

export default function RouteProtector({ children }: { children: React.ReactNode }) {
    // TODO: Add session logic
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to={routes.login} />;
  }

  return <>{children}</>;
}