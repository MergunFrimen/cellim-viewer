import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

export function MainLayout({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <header className="container mx-auto flex flex-row justify-between p-2">
        <nav>
          <Button variant="link" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="link" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant="link" asChild>
            <Link to="/docs">Docs</Link>
          </Button>
          <Button variant="link" asChild>
            <Link to="/docs">Docs</Link>
          </Button>
          {isAuthenticated && (
            <Button variant="link" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
          {isAuthenticated ? (
            <Button variant="link" onClick={() => handleLogout()}>
              Logout
            </Button>
          ) : (
            <Button variant="link" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
        <ThemeToggle />
      </header>

      <main className="container mx-auto flex-grow px-4 py-8">{children}</main>

      <footer className="py-4 text-center">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} CELLIM View
        </p>
      </footer>
    </div>
  );
}
