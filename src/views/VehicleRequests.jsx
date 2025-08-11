import React, { useState } from 'react';
import { adminAPI } from '../api/adminAPI';
import { useVehicleRequestsSocket } from '../hooks/useVehicleRequestsSocket';
import VehicleDetailModal from '../components/VehicleDetailModal';
import Pagination from '../components/Pagination';

const VehicleRequests = () => {
    const [page, setPage] = useState(1);
    const { vehicles, loading, error, totalPages, removeVehicleOptimistically } = useVehicleRequestsSocket(page);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailedVehicle, setDetailedVehicle] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [actionError, setActionError] = useState('');

    // Function to handle clicking a row to open the detail view
    const handleRowClick = async (vehicleId) => {
        setDetailLoading(true);
        setActionError('');
        setIsDetailModalOpen(true);
        try {
            const response = await adminAPI.getDetailsVehicle(vehicleId);
            setDetailedVehicle(response.data.data);
        } catch (err) {
            setActionError('Failed to load vehicle details. Please close and try again.');
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setDetailedVehicle(null);
    };

    const handleApprove = async (vehicleId) => {
        if (!window.confirm("Are you sure you want to approve this vehicle?")) return;
        try {
            setActionError('');
            await adminAPI.decisionVehicle({ vehicleId, status: true });
            removeVehicleOptimistically(vehicleId);
            handleCloseModal();
        } catch (err) {
            setActionError('Failed to approve vehicle. Please try again.');
        }
    };

    const handleReject = async (vehicleId, rejectedReason) => {
        try {
            setActionError('');
            await adminAPI.decisionVehicle({ vehicleId, status: false, rejectedReason });
            removeVehicleOptimistically(vehicleId);
            handleCloseModal();
        } catch (err) {
            setActionError('Failed to reject vehicle. Please try again.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Vehicle Requests</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Vehicle</th>
                                <th scope="col" className="px-6 py-3">Brand</th>
                                <th scope="col" className="px-6 py-3">Registration ID</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-6">Loading...</td></tr>
                            ) : vehicles.length > 0 ? (
                                vehicles.map((vehicle, index) => (
                                    vehicle && (
                                        <tr 
                                            key={vehicle.id || index} 
                                            className="bg-white border-b hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleRowClick(vehicle.id)}
                                        >
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-3">
                                                <img className="w-20 h-12 object-cover rounded-md bg-gray-200" src={vehicle.imageFront} onError={(e) => e.target.src='https://placehold.co/80x48/EFEFEF/AAAAAA?text=Img'} alt={`${vehicle.title}`} />
                                                <span>{vehicle.title}</span>
                                            </th>
                                            <td className="px-6 py-4">{vehicle.brand}</td>
                                            <td className="px-6 py-4">{vehicle.vehicleRegistrationId}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center p-6">No pending vehicle requests.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            {/* Render the new detail modal */}
            <VehicleDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                vehicle={detailedVehicle}
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

export default VehicleRequests;
