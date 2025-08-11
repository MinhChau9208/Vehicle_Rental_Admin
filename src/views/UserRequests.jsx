import React, { useState } from 'react';
import { adminAPI } from '../api/adminAPI';
import { useUserRequestsSocket } from '../hooks/useUserRequestsSocket';
import Modal from '../components/Modal';
import UserDetailModal from '../components/UserDetailModal'; // Import the new detail modal
import Pagination from '../components/Pagination';

const UserRequests = () => {
    const [page, setPage] = useState(1);
    
    // Use the custom hook to get all the data and logic
    const { users, loading, error, totalPages, removeUserOptimistically } = useUserRequestsSocket(page);

    // State for the rejection modal remains in the component
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailedUser, setDetailedUser] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionError, setActionError] = useState(''); 

    // Function to handle clicking a row to open the detail view
    const handleRowClick = async (userId) => {
        setDetailLoading(true);
        setActionError('');
        setIsDetailModalOpen(true);
        try {
            const response = await adminAPI.getDetailsLevel2User(userId);
            setDetailedUser(response.data.data);
        } catch (err) {
            setActionError('Failed to load user details. Please close and try again.');
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setDetailedUser(null);
    };

    const handleApprove = async (userId) => {
        try {
            setActionError('');
            await adminAPI.decisionUserLevel2({ userId, status: true });
            // Optimistically remove the user from the UI
            removeUserOptimistically(userId);
            handleCloseModal();
        } catch (err) {
            setActionError('Failed to approve user. Please try again.');
        }
    };

    const handleReject = async (userId, reason) => {
        if (!reason) {
            setActionError('Rejection reason is required.');
            return;
        }
        try {
            setActionError('');
            await adminAPI.decisionUserLevel2({ userId, status: false, rejectedReason: reason });
            removeUserOptimistically(userId);
            handleCloseModal();
        } catch (err) {
            setActionError('Failed to reject user. Please try again.');
        }
    };

    const renderActionButtons = (user) => (
        <div className="flex space-x-2">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(user.id);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
                View Details
            </button>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Level 2 Requests</h1>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nickname</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-6 text-gray-500">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" className="text-center p-6 text-red-500">Error: {error}</td></tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(user.id)}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nickname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {renderActionButtons(user)}
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

            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                user={detailedUser}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            {detailLoading && isDetailModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white text-lg">Loading Details...</div>
                </div>
            )}
            {actionError && (
                 <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
                    <p>{actionError}</p>
                    <button onClick={() => setActionError('')} className="absolute top-1 right-2 text-white font-bold">&times;</button>
                </div>
            )}
        </div>
    );
};

export default UserRequests;
