export const AuthService = {
  setToken(token: string) {
    localStorage.setItem("access_token", token);
  },

  getToken() {
    return localStorage.getItem("access_token");
  },

  removeToken() {
    localStorage.removeItem("access_token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async login() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/login/user",
        {
          method: "POST",
        },
      );

      const data = await response.json();
      if (data.access_token) {
        this.setToken(data.access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  async logout() {
    try {
      await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.removeToken();
    }
  },

  async checkAuth() {
    if (!this.getToken()) return false;

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/check-auth",
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );

      return response.status === 200;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  },
};
