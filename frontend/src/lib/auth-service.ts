import {
  authGetUsersToken,
  authLoginUser,
  authLogout,
  authVerifyAuth,
} from "./client";

export const AuthService = {
  async login() {
    try {
      const response = await authLoginUser();
      return response.response.ok;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  async logout() {
    try {
      const response = await authLogout();
      return response.response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },

  async getToken(): Promise<string | undefined> {
    try {
      const response = await authGetUsersToken();
      return response.data ?? undefined;
    } catch (error) {
      console.error("Auth check error:", error);
      return undefined;
    }
  },

  async verify() {
    try {
      const response = await authVerifyAuth();
      return !!response.data;
    } catch {
      return false;
    }
  },
};
