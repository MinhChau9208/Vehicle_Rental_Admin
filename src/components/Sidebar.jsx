import React from 'react';
import { Home, UserCheck, CarTaxiFront, Users, Car, LogOut } from '../assets/icon';

const Sidebar = ({ activeView, setActiveView, handleLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'user-requests', label: 'User Requests', icon: UserCheck },
        { id: 'vehicle-requests', label: 'Vehicle Requests', icon: CarTaxiFront },
        { id: 'users', label: 'Manage Users', icon: Users },
        { id: 'vehicles', label: 'Manage Vehicles', icon: Car },
    ];

    return (
        <div className="w-64 bg-gray-800 text-gray-200 flex flex-col h-screen sticky top-0">
            <div className="p-4 border-b border-gray-700 flex items-center space-x-2">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <React.Suspense fallback={<div className="w-6 h-6" />}>
                        <Car size={24} />
                    </React.Suspense>
                </div>
                <h1 className="text-xl font-bold text-white">Vehicle Admin</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === item.id 
                            ? 'bg-gray-900 text-white' 
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <React.Suspense fallback={<div className="w-5 h-5 mr-3" />}>
                            <item.icon className="mr-3" size={20} />
                        </React.Suspense>
                        {item.label}
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                    <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Kiet" alt="Admin Avatar" className="w-10 h-10 rounded-full bg-indigo-200" />
                    <div>
                        <p className="font-semibold text-white">Kietpep1303</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="w-full mt-4 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    <React.Suspense fallback={<div className="w-5 h-5 mr-3" />}>
                        <LogOut className="mr-3" size={20} />
                    </React.Suspense>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;