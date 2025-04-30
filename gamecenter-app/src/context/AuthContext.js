import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // <<<--- YENİ: Hata state'i eklendi

    useEffect(() => {
        const checkSession = async () => {
            // setLoading(true); // Zaten başta true
             setError(null); // <<<--- GÜNCELLENDİ: Kontrole başlarken hatayı temizle
            try {
                const response = await axios.get('http://localhost:3001/api/auth/session', {
                    withCredentials: true,
                });
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                    console.log("Aktif session bulundu:", response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Session check hatası:", error.response ? error.response.data : error.message);
                setError(error.response?.data?.message || 'Oturum kontrol edilemedi.'); // <<<--- GÜNCELLENDİ: Hata state'ini ayarla
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null); // <<<--- GÜNCELLENDİ: Login'e başlarken hatayı temizle (Bu satır zaten vardı ve artık çalışacak)
        try {
            const response = await axios.post('http://localhost:3001/api/login', { email, password }, {
                withCredentials: true,
            });
            setUser(response.data.user);
            console.log("Context üzerinden login başarılı:", response.data.user);
            return response.data;
        } catch (error) {
            console.error("Context login hatası:", error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'Giriş başarısız oldu.'); // <<<--- GÜNCELLENDİ: Hata state'ini ayarla
            setUser(null);
            throw error; // Hatanın Login sayfasında da yakalanması için fırlat
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null); // <<<--- GÜNCELLENDİ: Logout'a başlarken hatayı temizle
        try {
            await axios.post('http://localhost:3001/api/auth/logout', {}, {
                 withCredentials: true,
             });
            setUser(null);
            console.log("Context üzerinden logout yapıldı.");
        } catch (error) {
            console.error("Context logout hatası:", error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'Çıkış yapılamadı.'); // <<<--- GÜNCELLENDİ: Hata state'ini ayarla
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Context değeri
    const value = {
        user,
        setUser,
        login,
        logout,
        isLoading: loading,
        error // <<<--- YENİ: Hata state'ini context değerine ekledik
    };

    return (
        <AuthContext.Provider value={value}>
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