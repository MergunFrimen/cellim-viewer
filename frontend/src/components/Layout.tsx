import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme/ThemeToggle";
import { Button } from "./ui/button";

export function Layout({ children }: { children: ReactNode | ReactNode[] }) {
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
