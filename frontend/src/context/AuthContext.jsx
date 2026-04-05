import React, { createContext, useReducer, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

// 1. Define Initial State
const initialState = {
    user: null,
    loading: true,
    error: null
};

// 2. Setup Reducer Logic
const authReducer = (state, action) => {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                loading: false,
                error: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    // 3. Initialize useReducer
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Initial check for persisted login
    useEffect(() => {
        const profile = localStorage.getItem('profile');
        if (profile) {
            dispatch({ type: 'INITIALIZE', payload: JSON.parse(profile) });
        } else {
            dispatch({ type: 'INITIALIZE', payload: null });
        }
    }, []);

    const login = async (formData) => {
        try {
            const { data } = await API.post('/auth/login', formData);
            // ApiResponse shape: { success, data: { user, token }, message }
            const profile = { ...data.data.user, token: data.data.token };
            localStorage.setItem('profile', JSON.stringify(profile));
            dispatch({ type: 'AUTH_SUCCESS', payload: profile });
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Login failed' });
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const { data } = await API.post('/auth/register', formData);
            const profile = { ...data.data.user, token: data.data.token };
            localStorage.setItem('profile', JSON.stringify(profile));
            dispatch({ type: 'AUTH_SUCCESS', payload: profile });
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Registration failed' });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('profile');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        // We spread `...state` so that `user`, `loading`, and `error` are easily accessible
        <AuthContext.Provider value={{ ...state, dispatch, login, register, logout }}>
            {!state.loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
