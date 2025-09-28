"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../api/admin'; // Import API functions
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'; // Import shadcn/ui Select

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
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Employee Management</CardTitle>
        <Button
          onClick={() => openModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </Button>
      </CardHeader>
      <CardContent>
        {fetchingEmployees ? (
          <p className="text-gray-600">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="text-gray-600">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hired Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell>{employee.hiredDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(employee)}
                        className="mr-2"
                        disabled={loading}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(employee.id)}
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modal for Add/Edit Employee */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="employeeName">Name</Label>
                  <Input
                    type="text"
                    id="employeeName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employeeEmail">Email</Label>
                  <Input
                    type="email"
                    id="employeeEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employeeRole">Role</Label>
                  <Select value={role} onValueChange={setRole} disabled={loading}>
                    <SelectTrigger id="employeeRole">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      {/* Add other roles as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employeeStatus">Status</Label>
                  <Select value={status} onValueChange={(value: 'Active' | 'Inactive') => setStatus(value)} disabled={loading}>
                    <SelectTrigger id="employeeStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Employee'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminEmployees;