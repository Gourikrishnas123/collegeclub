import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi, loginApi as apiLogin, logoutApi as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await getMeApi();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    if (data && data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data && data.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isClubAdmin = user?.role === 'club_admin';
  const isMember = user?.role === 'member';

  // Extract actual string ID whether user.clubId is a populated object or string ID
  const getClubIdStr = (val) => {
    if (!val) return null;
    if (typeof val === 'object') {
      return val._id ? val._id.toString() : val.toString();
    }
    return val.toString();
  };

  const ownClubId = getClubIdStr(user?.clubId);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      checkAuth,
      isSuperAdmin,
      isClubAdmin,
      isMember,
      ownClubId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
