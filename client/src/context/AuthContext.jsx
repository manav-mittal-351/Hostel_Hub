import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
                
                // Fetch latest profile to sync state (roomNumber, etc.)
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${parsedUser.token}`
                        }
                    };
                    const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
                    const updatedUser = { ...parsedUser, ...data };
                    setUser(updatedUser);
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                } catch (error) {
                    console.error('Failed to sync profile:', error);
                    if (error.response && error.response.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
