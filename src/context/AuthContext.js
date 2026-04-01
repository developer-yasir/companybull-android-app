import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';
import { useRouter, useSegments } from 'expo-router';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        loadStorageData();
    }, []);

    // Session Persistence: Load token and user from SecureStore on startup
    const loadStorageData = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('userToken');
            const storedUser = await SecureStore.getItemAsync('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                // Optional: Verify token with /auth/me here
            }
        } catch (e) {
            console.error('Failed to load auth data', e);
        } finally {
            setIsLoading(false);
        }
    };

    // Protect Routes: Redirect based on auth state
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(tabs)';
        const inLoginGroup = segments[0] === 'login';

        if (!token && inAuthGroup) {
            // Redirect to login if not authenticated and trying to access tabs
            router.replace('/login');
        } else if (token && inLoginGroup) {
            // Redirect to home if already authenticated and trying to access login
            router.replace('/');
        }
    }, [token, segments, isLoading]);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { token: newToken, ...userData } = response.data;

            setToken(newToken);
            setUser(userData);

            await SecureStore.setItemAsync('userToken', newToken);
            await SecureStore.setItemAsync('userData', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            console.error('Login error', error.response?.data);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Connection failed. Please try again.' 
            };
        }
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
