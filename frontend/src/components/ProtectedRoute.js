import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'

const ProtectedRoute = ({ children, restricted }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Show a loader while authentication status is checked
    }

    if (restricted && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
