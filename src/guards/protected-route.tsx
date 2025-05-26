// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
    const { authToken, loading } = useAuth();

    if (!authToken) {
        return <Navigate to={redirectPath} replace />;
    }

    // If authenticated, render the child routes or content
    return <Outlet />;
};

export default ProtectedRoute;