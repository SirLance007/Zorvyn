import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    
    // Agar user log in nahi hai toh use /login pe bhej do
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    // Agar log in hai toh protected page render hone do
    return children;
};

export default ProtectedRoute;
