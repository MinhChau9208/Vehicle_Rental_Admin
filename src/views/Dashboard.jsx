import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/adminAPI';
import StatCard from '../components/StatCard';
import { Users, Car } from '../assets/icon';

const Dashboard = () => {
    const [userStats, setUserStats] = useState(null);
    const [vehicleStats, setVehicleStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userRes, vehicleRes] = await Promise.all([
                    adminAPI.getUsersStatistics(),
                    adminAPI.getVehiclesStatistics()
                ]);
                console.log('getuser', userRes.data);
                console.log('vehicle data:', vehicleRes);
                setUserStats(userRes.data.data);
                setVehicleStats(vehicleRes.data.data);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading statistics...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard title="Total Users" value={userStats?.total || 0} icon={<Users size={24} color="white" />} color="bg-blue-500" />
                <StatCard title="Active Users" value={userStats?.active || 0} icon={<Users size={24} color="white" />} color="bg-green-500" />
                <StatCard title="Suspended Users" value={userStats?.suspended || 0} icon={<Users size={24} color="white" />} color="bg-red-500" />
                <StatCard title="Level 3 Admins" value={userStats?.level3 || 0} icon={<Users size={24} color="white" />} color="bg-purple-500" />
                
                <StatCard title="Total Vehicles" value={vehicleStats?.total || 0} icon={<Car size={24} color="white" />} color="bg-indigo-500" />
                <StatCard title="Approved Vehicles" value={vehicleStats?.approved || 0} icon={<Car size={24} color="white" />} color="bg-teal-500" />
                <StatCard title="Pending Vehicles" value={vehicleStats?.pending || 0} icon={<Car size={24} color="white" />} color="bg-yellow-500" />
                <StatCard title="Rejected Vehicles" value={vehicleStats?.rejected || 0} icon={<Car size={24} color='white'/>} color="bg-red-500"/>
                <StatCard title="Suspended Vehicles" value={vehicleStats?.suspended || 0} icon={<Car size={24} color='white'/>} color="bg-orange-500"/>
                <StatCard title="Hidden Vehicles" value={vehicleStats?.hidden || 0} icon={<Car size={24} color="white" />} color="bg-gray-500" />
            </div>
        </div>
    );
};

export default Dashboard;
