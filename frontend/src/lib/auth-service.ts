export const AuthService = {
  async login() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/login/user",
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      return response.ok && data.access_token;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  async logout() {
    try {
      await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },

  async getToken(): Promise<string | undefined> {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/me/token",
        {
          credentials: "include",
        },
      );

      const token = await response.text();

      return token;
    } catch (error) {
      console.error("Auth check error:", error);
      return undefined;
    }
  },

  async checkAuth() {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/verify", {
        credentials: "include",
      });

      return response.status === 200;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  },
};
