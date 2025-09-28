"use client";

import React, { useState } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., 'employee', 'manager'
  status: 'Active' | 'Inactive';
  hiredDate: string;
}

const AdminEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    // Mock data for demonstration
    { id: 'EMP001', name: 'John Doe', email: 'john.doe@example.com', role: 'employee', status: 'Active', hiredDate: '2022-05-01' },
    { id: 'EMP002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'employee', status: 'Active', hiredDate: '2022-08-15' },
    { id: 'EMP003', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'manager', status: 'Inactive', hiredDate: '2021-11-20' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      if (currentEmployee) {
        // Update employee
        setEmployees(prevEmployees =>
          prevEmployees.map(employee =>
            employee.id === currentEmployee.id ? { ...employee, name, email, role, status } : employee
          )
        );
        showSuccess('Employee updated successfully!');
      } else {
        // Create new employee
        const newEmployee: Employee = {
          id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
          name,
          email,
          role,
          status,
          hiredDate: new Date().toISOString().split('T')[0],
        };
        setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
        showSuccess('Employee created successfully!');
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

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== employeeId));
      showSuccess('Employee deleted successfully!');
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

      {employees.length === 0 ? (
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