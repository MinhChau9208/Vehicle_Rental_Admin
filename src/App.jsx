import React, { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import UserRequests from './views/UserRequests';
import VehicleRequests from './views/VehicleRequests';
import ManageUsers from './views/ManageUsers';
import ManageVehicles from './views/ManageVehicles';
import PlaceholderView from './views/PlaceholderView';

function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('refreshToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard />;
            case 'user-requests':
                return <UserRequests />;
            case 'vehicle-requests':
                return <VehicleRequests />;
            case 'users':
                return <ManageUsers />;
            case 'vehicles':
                return <ManageVehicles />;
            default:
                return <Dashboard />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="flex bg-gray-100 min-h-screen font-sans">
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                handleLogout={handleLogout} 
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
