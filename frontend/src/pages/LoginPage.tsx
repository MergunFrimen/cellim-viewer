import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const success = await login();
    setIsLoggingIn(false);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Login Page</h1>
        <Button onClick={handleLogin} disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
