import { io } from 'socket.io-client';

const SOCKET_URL = 'https://vehicle.kietpep1303.com/admin';

let socket;

export const getSocket = () => {
    // If the socket instance doesn't exist, create it
    if (!socket) {
        const accessToken = localStorage.getItem('accessToken');
        
        // Initialize the connection with authentication
        socket = io(SOCKET_URL, {
            auth: { accessToken },
        });

        socket.on('connect', () => {
            console.log('Socket.IO connection established successfully.');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err.message);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket.IO disconnected: ${reason}`);
            socket = null;
        });
    }
    
    return socket;
};
