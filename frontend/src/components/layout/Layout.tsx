import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
