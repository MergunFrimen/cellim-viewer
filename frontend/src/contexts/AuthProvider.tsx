import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { AuthService } from "../lib/auth-service";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthProviderState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const initialState: AuthProviderState = {
  isAuthenticated: false,
  isLoading: false,
  login: async () => false,
  logout: async () => undefined,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

export const AuthProvider = ({ children, ...props }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authStatus = await AuthService.verify();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  const login = async () => {
    const success = await AuthService.login();
    setIsAuthenticated(success);
    return success;
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined) throw new Error("Missing AuthProvider");

  return context;
};
