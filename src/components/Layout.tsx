import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <Link to="/" className="text-2xl font-bold">
            CELLIM View
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/search">Search</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t py-4 text-center">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} CELLIM View | Visualization Platform
        </p>
      </footer>
    </div>
  );
}
