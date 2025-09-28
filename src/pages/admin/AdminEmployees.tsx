"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../api/admin'; // Import API functions

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., 'employee', 'manager'
  status: 'Active' | 'Inactive';
  hiredDate: string;
}

const AdminEmployees = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [loading, setLoading] = useState(false); // For modal actions

  useEffect(() => {
    const getEmployees = async () => {
      if (!token) {
        setFetchingEmployees(false);
        return;
      }
      setFetchingEmployees(true);
      const { data, error } = await fetchAllEmployees(token);
      if (data) {
        setEmployees(data);
      } else if (error) {
        showError(error);
      }
      setFetchingEmployees(false);
    };
    getEmployees();
  }, [token]);

  const openModal = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
      setName(employee.name);
      setEmail(employee.email);
      setRole(employee.role);
      setStatus(employee.status);
    } else {
      setCurrentEmployee(null);
      setName('');
      setEmail('');
      setRole('employee');
      setStatus('Active');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('You must be logged in to manage employees.');
      return;
    }
    setLoading(true);
    try {
      if (currentEmployee) {
        // Update employee
        const { data, error } = await updateEmployee(token, currentEmployee.id, name, email, role, status);
        if (data) {
          setEmployees(prevEmployees =>
            prevEmployees.map(employee =>
              employee.id === currentEmployee.id ? { ...employee, name: data.name, email: data.email, role: data.role, status: data.status } : employee
            )
          );
          showSuccess('Employee updated successfully!');
        } else if (error) {
          showError(error);
        }
      } else {
        // Create new employee
        const { data, error } = await createEmployee(token, name, email, role, status);
        if (data) {
          setEmployees(prevEmployees => [...prevEmployees, data]);
          showSuccess('Employee created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      closeModal();
    } catch (error) {
      showError('Failed to save employee.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    if (!token) {
      showError('You must be logged in to delete employees.');
      return;
    }

    setLoading(true);
    try {
      const { message, error } = await deleteEmployee(token, employeeId);
      if (message) {
        setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== employeeId));
        showSuccess('Employee deleted successfully!');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to delete employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Employee Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      {fetchingEmployees ? (
        <p className="text-gray-600">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-600">No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hired Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.hiredDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(employee)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Employee */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="employeeName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="employeeEmail"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="employeeRole" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="employeeRole"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  {/* Add other roles as needed */}
                </select>
              </div>
              <div>
                <label htmlFor="employeeStatus" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="employeeStatus"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;