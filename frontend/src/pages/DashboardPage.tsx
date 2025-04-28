import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthService } from "@/lib/auth-service";

export function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard Page</h1>
      <div>
        <span>Token: </span>
        <span>{AuthService.getToken()}</span>
      </div>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
