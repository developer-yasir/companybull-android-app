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
            console.log('[AUTH] Starting loadStorageData...');
            const storedToken = await SecureStore.getItemAsync('userToken');
            const storedUser = await SecureStore.getItemAsync('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                console.log('[AUTH] Storage load success. User:', JSON.parse(storedUser).name);
            } else {
                console.log('[AUTH] No stored credentials found.');
            }
        } catch (error) {
            console.error('[AUTH] Storage Load Error:', error);
        } finally {
            console.log('[AUTH] loadStorageData complete. Setting isLoading to false.');
            setIsLoading(false);
        }
    };

    // Protect Routes: Redirect based on auth state
    useEffect(() => {
        if (isLoading) return;

        const currentSegment = segments[0];
        const inAuthGroup = currentSegment === '(tabs)';
        const inLoginGroup = currentSegment === 'login' || currentSegment === undefined; 

        console.log(`[NAV] Check - Token: ${!!token}, Group: ${currentSegment}`);

        // Only redirect if absolutely necessary to avoid loops
        if (!token && inAuthGroup) {
            console.log('[NAV] Unauthenticated. Pushing to login...');
            router.replace('/login');
        } else if (token && inLoginGroup) {
            console.log('[NAV] Authenticated. Pushing to dashboard...');
            router.replace('/(tabs)');
        }
    }, [token, segments, isLoading]);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('auth/login', { email, password });
            console.log('API Login Response:', response.data ? 'Success' : 'Empty');
            const { token: newToken, ...userData } = response.data;

            console.log('Storing token and redirecting...');
            setToken(newToken);
            setUser(userData);

            await SecureStore.setItemAsync('userToken', newToken);
            await SecureStore.setItemAsync('userData', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            console.error('Login error detailed:', error);
            let msg = 'Unknown connection error';
            if (error.code === 'ERR_NETWORK') msg = `Network Error: Link to ${apiClient.defaults.baseURL} failed. Reason: ${error.message}`;
            if (error.code === 'ECONNABORTED') msg = 'Timeout: Server took too long to respond.';
            if (error.response) msg = error.response.data?.message || 'Server error (' + error.response.status + ')';

            return { success: false, message: msg };
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
