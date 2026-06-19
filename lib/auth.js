"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCustomerDetails, logoutCustomer } from './shopify';

export const AUTH_TOKEN_KEY = 'neo_mirai_customer_token';

const AuthContext = createContext({
  customer: null,
  token: null,
  isLoggedIn: false,
  loading: true,
  loginWithToken: async () => null,
  logout: async () => {},
  refreshCustomer: async () => null,
});

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithToken = useCallback(async (accessToken) => {
    try {
      const data = await getCustomerDetails(accessToken);
      if (data) {
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        setToken(accessToken);
        setCustomer(data);
        return data;
      }
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      setCustomer(null);
      return null;
    } catch (err) {
      console.error("Failed to fetch customer:", err);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      setCustomer(null);
      return null;
    }
  }, []);

  const refreshCustomer = useCallback(async () => {
    if (!token) return null;
    return loginWithToken(token);
  }, [token, loginWithToken]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutCustomer(token);
      } catch (err) {
        console.warn("Revoking token failed:", err);
      }
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setCustomer(null);
  }, [token]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (savedToken) {
      setTimeout(() => {
        loginWithToken(savedToken).finally(() => setLoading(false));
      }, 0);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  }, [loginWithToken]);

  const isLoggedIn = !!token && !!customer;

  return (
    <AuthContext.Provider value={{
      customer,
      token,
      isLoggedIn,
      loading,
      loginWithToken,
      logout,
      refreshCustomer,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
