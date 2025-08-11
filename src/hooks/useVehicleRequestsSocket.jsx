import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socketService';

/**
 * A custom React hook to manage real-time vehicle request data via Socket.IO.
 * @param {number} currentPage - The current page number for pagination.
 * @returns {object} - An object containing vehicles, loading state, error, and pagination data.
 */
export const useVehicleRequestsSocket = (currentPage) => {
    const [vehicles, setVehicles] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = getSocket();
        const socket = socketRef.current;

        // Function to emit the event to fetch data
        const fetchDataForPage = (page) => {
            setLoading(true);
            socket.emit('getRequestedVehicles', { page, limit: 5 });
        };
        fetchDataForPage(currentPage);

        // Listener for receiving the list of vehicles
        const handleRequestedVehicles = (data) => {
            if (data.vehicles) {
                console.log("Vehicle response from backend", data.vehicles);
                if (data.totalPages) {
                    setVehicles(data.vehicles);
                    setTotalPages(data.totalPages);
                } else if (currentPage === 1) {
                    // A new vehicle was added, prepend it to the list if on the first page
                    setVehicles(prevVehicles => [data.vehicles[0], ...prevVehicles]);
                }
            }
            setLoading(false);
        };
        
        // Listener for when a decision is made by another admin
        const handleDecision = (data) => {
            setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== data.vehicleId));
        };

        // Register event listeners based on the provided documentation
        socket.on('requestedVehicles', handleRequestedVehicles);
        socket.on('decisionVehicle', handleDecision);

        return () => {
            socket.off('requestedVehicles', handleRequestedVehicles);
            socket.off('decisionVehicle', handleDecision);
        };

    }, [currentPage]);

    const removeVehicleOptimistically = (vehicleId) => {
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
    };

    return { vehicles, loading, error, totalPages, removeVehicleOptimistically };
};
