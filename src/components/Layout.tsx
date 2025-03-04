import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Layout({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <Link to="/" className="text-2xl font-bold">
            CELLIM View
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="search"
                placeholder="Search entries..."
                className="pl-10 w-[300px]"
              />
            </div>
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
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} CELLIM View | Visualization Platform
        </p>
      </footer>
    </div>
  );
}
