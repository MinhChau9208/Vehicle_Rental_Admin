import React, { useState, useEffect } from 'react';

// Component and View Imports
import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import UserRequests from './views/UserRequests';
import VehicleRequests from './views/VehicleRequests';
import PlaceholderView from './views/PlaceholderView';

// Main App component to control layout and view rendering
function App() {
    const [activeView, setActiveView] = useState('dashboard');
    // State to track if the user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to handle the initial loading/auth check
    const [isLoading, setIsLoading] = useState(true);

    // Check for refresh token on initial component mount
    useEffect(() => {
        const token = localStorage.getItem('refreshToken');
        if (token) {
            setIsAuthenticated(true);
        }
        // Set loading to false after the check is complete
        setIsLoading(false);
    }, []);

    // This function will be passed to the Login component
    // to update the state upon successful login
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    
    // Function to handle user logout
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    // Renders the currently active view based on state
    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard />;
            case 'user-requests':
                return <UserRequests />;
            case 'vehicle-requests':
                return <VehicleRequests />;
            case 'users':
                return <PlaceholderView title="Manage Users" />;
            case 'vehicles':
                return <PlaceholderView title="Manage Vehicles" />;
            default:
                return <Dashboard />;
        }
    };

    // Show a loading indicator while checking for the token
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    // If not authenticated, show the Login page
    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // If authenticated, show the main application
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
