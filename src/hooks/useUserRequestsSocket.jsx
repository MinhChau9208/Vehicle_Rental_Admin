import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socketService';

/**
 * A custom React hook to manage real-time user request data via Socket.IO.
 * @param {number} currentPage - The current page number for pagination.
 * @returns {object} - An object containing users, loading state, error, and pagination data.
 */
export const useUserRequestsSocket = (currentPage) => {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Use a ref to hold the socket instance to avoid re-renders
    const socketRef = useRef(null);

    useEffect(() => {
        // Get the singleton socket instance
        socketRef.current = getSocket();
        const socket = socketRef.current;

        // Function to emit the event to fetch data
        const fetchDataForPage = (page) => {
            setLoading(true);
            socket.emit('getRequestedUserLevel2', { page, limit: 5 });
        };

        // Initial fetch when the component mounts or page changes
        fetchDataForPage(currentPage);

        // Listener for receiving the list of users
        const handleRequestedUserLevel2 = (data) => {
            if (data.users) {
                setUsers(data.users);
            }
            if (data.totalPages) {
                setTotalPages(data.totalPages);
            }
            setLoading(false);
        };

        // Listener for when a new request comes in
        const handleNewUserRequest = (data) => {
            // Only add the new user if we are on the first page
            if (currentPage === 1 && data.users && data.users.length > 0) {
                setUsers(prevUsers => [data.users[0], ...prevUsers]);
            }
        };
        
        // Listener for when a decision is made by another admin
        const handleDecision = (data) => {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== data.userId));
        };

        // Register event listeners
        socket.on('requestedUserLevel2', handleRequestedUserLevel2);
        socket.on('newUserRequest', handleNewUserRequest); // Assuming this event name for new single records
        socket.on('decisionUserLevel2', handleDecision);

        // Cleanup function to remove listeners when the component unmounts or page changes
        return () => {
            socket.off('requestedUserLevel2', handleRequestedUserLevel2);
            socket.off('newUserRequest', handleNewUserRequest);
            socket.off('decisionUserLevel2', handleDecision);
        };

    }, [currentPage]); // Re-run the effect if the currentPage changes

    // Expose a function to allow the component to manually remove a user for optimistic UI updates
    const removeUserOptimistically = (userId) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    };

    return { users, loading, error, totalPages, removeUserOptimistically };
};
