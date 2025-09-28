"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showError, showSuccess } from '../../utils/toast';

const AdminProfile = () => {
  const { user, token } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(''); // Assuming a name field will be added to user profile
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      // If you add a 'name' field to your user model in the backend, fetch it here
      // setName(user.name || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real MERN app, you'd send a PUT request to your backend to update the user profile
    // For now, we'll just simulate success/failure
    try {
      // Example: const response = await fetch('http://localhost:5000/api/admin/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ email, name }),
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   showSuccess('Admin profile updated successfully!');
      //   // Optionally update the user context with new data
      // } else {
      //   showError(data.error || 'Failed to update admin profile.');
      // }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showSuccess('Admin profile updated successfully! (Backend integration needed)');
    } catch (error) {
      showError('An error occurred while updating admin profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Admin Profile</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
            value={email}
            disabled // Email is often not directly editable or requires special handling
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;