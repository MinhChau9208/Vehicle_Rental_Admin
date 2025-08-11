import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/adminAPI';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, search, statusFilter };
      const response = await adminAPI.getUsers(params);
      if (response.data.status === 200) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError('Failed to fetch users.');
      }
    } catch (err) {
      setError('An error occurred while fetching users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    try {
      const response = await adminAPI.suspendUser(selectedUser.id);
      if (response.data.status === 200) {
        alert('User suspended successfully!');
        setSelectedUser(null);
        fetchUsers();
      } else {
        alert('Failed to suspend user.');
      }
    } catch (err) {
      alert('An error occurred while suspending the user.');
      console.error(err);
    }
  };

  const handleUnsuspend = async () => {
    if (!selectedUser) return;
    try {
      const response = await adminAPI.unsuspendUser(selectedUser.id, 'APPROVED');
      if (response.data.status === 200) {
        alert('User unsuspended successfully!');
        setSelectedUser(null);
        fetchUsers();
      } else {
        alert('Failed to unsuspend user.');
      }
    } catch (err) {
      alert('An error occurred while unsuspending the user.');
      console.error(err);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'NO_LEVEL_2':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, statusFilter]);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (selectedUser) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Nickname:</strong> {selectedUser.nickname}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
          <p><strong>Account Level:</strong> {selectedUser.accountLevel}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(selectedUser.status)}`}>
              {selectedUser.status}
            </span>
          </p>
          <p><strong>ID Card:</strong> {selectedUser.idCardNumber}</p>
          <p><strong>Driver License:</strong> {selectedUser.driverLicense}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedUser(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to List
          </button>
          {selectedUser.status === 'SUSPENDED' ? (
            <button
              onClick={handleUnsuspend}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Unsuspend User
            </button>
          ) : (
            <button
              onClick={handleSuspend}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Suspend User
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
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
          <option value="ACTIVE">ACTIVE</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => setSelectedUser(user)}
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

export default ManageUsers;