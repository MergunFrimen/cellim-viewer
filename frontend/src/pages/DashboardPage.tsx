import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";

export function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard Page</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
