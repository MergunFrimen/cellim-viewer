import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page the user was trying to visit
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const success = await login();
    setIsLoggingIn(false);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <h1>Login Page</h1>
      <Button onClick={handleLogin} disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in..." : "Login"}
      </Button>
    </div>
  );
}
