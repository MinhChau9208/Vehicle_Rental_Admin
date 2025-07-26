import { io } from 'socket.io-client';

// The URL of your socket server
const SOCKET_URL = 'https://vehicle.kietpep1303.com/admin';

// This will hold the single socket instance
let socket;

/**
 * Creates and returns a singleton socket.io client instance.
 * It ensures that only one connection is made, even if called multiple times.
 */
export const getSocket = () => {
    // If the socket instance doesn't exist, create it
    if (!socket) {
        const accessToken = localStorage.getItem('accessToken');
        
        // Initialize the connection with authentication
        socket = io(SOCKET_URL, {
            auth: { accessToken },
            // Optional: prevent auto-connection until explicitly called
            // autoConnect: false, 
        });

        // You can add generic listeners here if needed, e.g., for logging
        socket.on('connect', () => {
            console.log('Socket.IO connection established successfully.');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err.message);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket.IO disconnected: ${reason}`);
            // Clean up the instance on disconnect to allow for a new connection later
            socket = null;
        });
    }
    
    return socket;
};
