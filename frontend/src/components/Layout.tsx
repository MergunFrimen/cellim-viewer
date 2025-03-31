import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Layout({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex flex-row items-center space-x-4">
          <nav className="space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/demo">Demo</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/docs">Docs</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-8">{children}</main>

      <Toaster />

      <footer className="border-t py-4 text-center">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} CELLIM View
        </p>
      </footer>
    </div>
  );
}
