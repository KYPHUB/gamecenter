import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';

const AuthContext = createContext();
const TOKEN_SECRET = 'GameCenter2025!';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  // Uygulama yüklendiğinde token kontrolü yap
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('user_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        setTokenChecked(true);
        return;
      }

      try {
        const res = await axios.post('/api/token-verify', { token: storedToken }, { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('user_token');
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('user_token');
        setUser(null);
      } finally {
        setLoading(false);
        setTokenChecked(true);
      }
    };

    checkToken();
  }, []);
  

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/login', { email, password }, { withCredentials: true });

      if (!res.data.success) throw new Error(res.data.message || 'Giriş başarısız oldu.');

      setUser(res.data.user);

      // Sunucudan token gelmezse, istemci tarafında bir tane oluştur (fallback)
      const token = res.data.token || sha256(email + TOKEN_SECRET).toString();
      localStorage.setItem('user_token', token);

      if (localStorage.getItem('rememberMe') === 'true') {
        localStorage.setItem('rememberedUser', JSON.stringify({
          email,
          token
        }));
      }

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user_token');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Çıkış yapılamadı.');
    } finally {
      setLoading(false);
    }
   // localStorage.removeItem('rememberedUser');
  };

  const verifyToken = async () => {
    const storedToken = localStorage.getItem('user_token');
    if (!storedToken) {
      setUser(null);
      sessionStorage.setItem('loginError', '1');
      return false;
    }

    try {
      const res = await axios.post('/api/token-verify', { token: storedToken }, { withCredentials: true });
      if (res.data.success) {
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (err) {
      await logout();
      sessionStorage.setItem('loginError', '1');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading: loading,
      verifyToken,
      tokenChecked,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};