import React, { useState } from 'react';
import { adminAPI } from '../api/adminAPI';
import { useUserRequestsSocket } from '../hooks/useUserRequestsSocket'; // Import the custom hook
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const UserRequests = () => {
    const [page, setPage] = useState(1);
    
    // Use the custom hook to get all the data and logic
    const { users, loading, error, totalPages, removeUserOptimistically } = useUserRequestsSocket(page);

    // State for the rejection modal remains in the component
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionError, setActionError] = useState(''); // For errors on approve/reject actions

    const openRejectionModal = (user) => {
        setSelectedUser(user);
        setRejectionReason('');
        setIsModalOpen(true);
    };

    const handleApprove = async (userId) => {
        if (!window.confirm("Are you sure you want to approve this user?")) return;
        try {
            setActionError('');
            await adminAPI.decisionUserLevel2({ userId, status: true });
            // Optimistically remove the user from the UI
            removeUserOptimistically(userId);
        } catch (err) {
            setActionError('Failed to approve user. Please try again.');
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            alert("Rejection reason is required.");
            return;
        }
        try {
            setActionError('');
            await adminAPI.decisionUserLevel2({ userId: selectedUser.id, status: false, rejectedReason: rejectionReason });
            setIsModalOpen(false);
            // Optimistically remove the user from the UI
            removeUserOptimistically(selectedUser.id);
        } catch (err) {
            setActionError('Failed to reject user. Please try again.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending User Requests</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            {actionError && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{actionError}</p>}
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Requested At</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-6">Loading...</td></tr>
                            ) : users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-3">
                                            <img className="w-10 h-10 rounded-full" src={user.avatar} onError={(e) => e.target.src='https://placehold.co/40x40/EFEFEF/AAAAAA?text=U'} alt={`${user.nickname} avatar`} />
                                            <span>{user.nickname}</span>
                                        </th>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleApprove(user.id)} className="font-medium text-green-600 hover:underline">Approve</button>
                                            <button onClick={() => openRejectionModal(user)} className="font-medium text-red-600 hover:underline">Reject</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center p-6">No pending user requests.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Reject request for ${selectedUser?.nickname}`}>
                <div className="space-y-4">
                    <p>Please provide a reason for rejecting this user's level 2 upgrade request.</p>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="e.g., Provided documents are blurry..."
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Confirm Rejection</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserRequests;
