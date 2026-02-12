import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../viewmodels/useAuthStore'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: Array<'MANAGER' | 'SUPERVISOR'>
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { currentUser } = useAuthStore()

    if (!currentUser) {
        return <Navigate to="/" replace />
    }

    const userRole = currentUser.role as 'MANAGER' | 'SUPERVISOR'

    if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
