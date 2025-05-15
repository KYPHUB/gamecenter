import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            setError(null);
            try {
                const response = await axios.get('/api/session-check', {
                    withCredentials: true,
                });
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                    console.log("✅ Aktif session bulundu:", response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("❌ Session kontrol hatası:", error.message);
                setError(error.response?.data?.message || 'Oturum kontrol edilemedi.');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/login', { email, password }, {
                withCredentials: true,
            });
            setUser(response.data.user);
            console.log("✅ Giriş başarılı:", response.data.user);
            return response.data;
        } catch (error) {
            console.error("❌ Login hatası:", error.message);
            setError(error.response?.data?.message || 'Giriş başarısız oldu.');
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post('/api/logout', {}, {
                withCredentials: true,
            });
            setUser(null);
            console.log("📤 Çıkış yapıldı.");
        } catch (error) {
            console.error("❌ Logout hatası:", error.message);
            setError(error.response?.data?.message || 'Çıkış yapılamadı.');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isLoading: loading, error }}>
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
