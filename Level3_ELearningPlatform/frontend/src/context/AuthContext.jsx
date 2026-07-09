import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.fetchCurrentUser();
          setUser(userData);
        } catch {
          authService.logout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser } = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const { user: newUser } = await authService.signup(name, email, password);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
