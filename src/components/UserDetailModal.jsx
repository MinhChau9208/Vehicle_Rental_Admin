import React, { useState, useEffect } from 'react';
import Modal from './Modal';


const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-md font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
);

const ImageDisplay = ({ label, src }) => (
    <div className="flex flex-col items-start space-y-2">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <a href={src} target="_blank" rel="noopener noreferrer">
            <img src={src} alt={label} className="w-56 h-40 object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity" />
        </a>
    </div>
);

const UserDetailModal = ({ isOpen, onClose, user, onApprove, onReject }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRejectionReason('');
            setActionError('');
        }
    }, [isOpen]);

    if (!isOpen || !user) return null;

    const handleReject = () => {
        if (!rejectionReason) {
            setActionError('Rejection reason is required.');
            return;
        }
        onReject(user.id, rejectionReason);
        onClose();
    };

    const handleApprove = () => {
        onApprove(user.id);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Details for ${user.nickname}`}>
            <div className="flex flex-col h-full">
                <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Full Name" value={`${user.firstName} ${user.middleName} ${user.lastName}`} />
                        <DetailItem label="Email" value={user.email} />
                        <DetailItem label="Phone Number" value={user.phoneNumber} />
                        <DetailItem label="ID Card Number" value={user.idCardNumber} />
                        <DetailItem label="Driver's License" value={user.driverLicense} />
                        <DetailItem label="Account Level" value={user.accountLevel} />
                    </div>

                    <div className="h-px bg-gray-200" />

                    <h3 className="text-lg font-bold">Verification Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <ImageDisplay label="ID Card - Front" src={user.idCardFront} />
                        <ImageDisplay label="ID Card - Back" src={user.idCardBack} />
                        <ImageDisplay label="Driver's License - Front" src={user.driverLicenseFront} />
                        <ImageDisplay label="Driver's License - Back" src={user.driverLicenseBack} />
                    </div>
                </div>

                <div className="flex-shrink-0 p-4 bg-gray-100 border-t">
                    <h3 className="text-lg font-bold mb-4">Make a Decision</h3>
                    <div className="space-y-4">
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => {
                                setRejectionReason(e.target.value);
                                setActionError('');
                            }}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows="2"
                            placeholder="If rejecting, provide a clear reason here..."
                        ></textarea>
                        {actionError && <p className="text-red-500 text-sm">{actionError}</p>}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleReject}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                                disabled={!rejectionReason}
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserDetailModal;
