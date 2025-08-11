import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/adminAPI';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, search, statusFilter };
      const response = await adminAPI.getVehicles(params);
      if (response.data.status === 200) {
        setVehicles(response.data.data.vehicles);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError('Failed to fetch vehicles.');
      }
    } catch (err) {
      setError('An error occurred while fetching vehicles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedVehicle) return;
    try {
      const response = await adminAPI.suspendVehicle(selectedVehicle.id);
      if (response.data.status === 200) {
        alert('Vehicle suspended successfully!');
        setSelectedVehicle(null);
        fetchVehicles();
      } else {
        alert('Failed to suspend vehicle.');
      }
    } catch (err) {
      alert('An error occurred while suspending the vehicle.');
      console.error(err);
    }
  };
  
  const handleUnsuspend = async () => {
    if (!selectedVehicle) return;
    try {
      const response = await adminAPI.unsuspendVehicle(selectedVehicle.id);
      if (response.data.status === 200) {
        alert('Vehicle unsuspended successfully!');
        setSelectedVehicle(null);
        fetchVehicles();
      } else {
        alert('Failed to unsuspend vehicle.');
      }
    } catch (err) {
      alert('An error occurred while unsuspending the vehicle.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, search, statusFilter]);

  if (loading) {
    return <div>Loading vehicles...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (selectedVehicle) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Title:</strong> {selectedVehicle.title}</p>
          <p><strong>License Plate:</strong> {selectedVehicle.vehicleRegistrationId}</p>
          <p><strong>Brand:</strong> {selectedVehicle.brand}</p>
          <p><strong>Model:</strong> {selectedVehicle.model}</p>
          <p><strong>Status:</strong> {selectedVehicle.status}</p>
          <p><strong>Description:</strong> {selectedVehicle.description}</p>
        </div>
        <h3 className="text-lg font-bold mt-4 mb-2">Vehicle Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedVehicle.imageFront && <img src={selectedVehicle.imageFront} alt="Front" className="w-full h-auto rounded-md" />}
          {selectedVehicle.imageEnd && <img src={selectedVehicle.imageEnd} alt="End" className="w-full h-auto rounded-md" />}
          {selectedVehicle.imageRearRight && <img src={selectedVehicle.imageRearRight} alt="Rear Right" className="w-full h-auto rounded-md" />}
          {selectedVehicle.imageRearLeft && <img src={selectedVehicle.imageRearLeft} alt="Rear Left" className="w-full h-auto rounded-md" />}
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setSelectedVehicle(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to List
          </button>
          {selectedVehicle.status !== 'APPROVED' ? (
            <button
              onClick={handleUnsuspend}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Unsuspend Vehicle
            </button>
          ) : (
            <button
              onClick={handleSuspend}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Suspend Vehicle
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Vehicles</h2>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or registration ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="HIDDEN">Hidden</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.vehicleRegistrationId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.vehicleType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageVehicles;