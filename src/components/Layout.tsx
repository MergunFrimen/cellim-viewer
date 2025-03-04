import { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Layout({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            CELLIM View
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/search" className="hover:underline">
              Search
            </Link>
            <Link to="/admin" className="hover:underline">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-200 p-4 text-center">
        © {new Date().getFullYear()} CELLIM View
      </footer>
    </div>
  );
}
