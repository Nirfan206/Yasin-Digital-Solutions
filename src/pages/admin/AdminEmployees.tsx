"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../api/admin/employees';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import EmployeeTable from '../../components/admin/employees/EmployeeTable';
import EmployeeFormModal from '../../components/admin/employees/EmployeeFormModal';
import EmployeeDetailsModal from '../../components/admin/employees/EmployeeDetailsModal';
import { Employee } from '../../types/api';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import LoadingSpinner

const AdminEmployees = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false); // For modal actions (save/delete)

  // Modals state
  const [isEmployeeFormModalOpen, setIsEmployeeFormModalOpen] = useState(false);
  const [currentEmployeeForForm, setCurrentEmployeeForForm] = useState<Employee | null>(null);
  const [isEmployeeDetailsModalOpen, setIsEmployeeDetailsModalOpen] = useState(false);
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState<Employee | null>(null);

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

  const handleOpenEmployeeFormModal = (employee?: Employee) => {
    setCurrentEmployeeForForm(employee || null);
    setIsEmployeeFormModalOpen(true);
  };

  const handleCloseEmployeeFormModal = () => {
    setIsEmployeeFormModalOpen(false);
    setCurrentEmployeeForForm(null);
  };

  const handleEmployeeFormSubmit = async (employeeData: Omit<Employee, 'id' | 'hiredDate'>) => {
    if (!token) {
      showError('You must be logged in to manage employees.');
      return;
    }
    setLoadingAction(true);
    try {
      if (currentEmployeeForForm) {
        // Update employee
        const { data, error } = await updateEmployee(token, currentEmployeeForForm.id, employeeData.name, employeeData.email, employeeData.role, employeeData.status);
        if (data) {
          setEmployees(prevEmployees =>
            prevEmployees.map(employee =>
              employee.id === currentEmployeeForForm.id ? { ...employee, name: data.name, email: data.email, role: data.role, status: data.status } : employee
            )
          );
          showSuccess('Employee updated successfully!');
        } else if (error) {
          showError(error);
        }
      } else {
        // Create new employee
        const { data, error } = await createEmployee(token, employeeData.name, employeeData.email, employeeData.role, employeeData.status);
        if (data) {
          setEmployees(prevEmployees => [...prevEmployees, data]);
          showSuccess('Employee created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      handleCloseEmployeeFormModal();
    } catch (error) {
      showError('Failed to save employee.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    if (!token) {
      showError('You must be logged in to delete employees.');
      return;
    }

    setLoadingAction(true);
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
      setLoadingAction(false);
    }
  };

  const handleOpenEmployeeDetailsModal = (employee: Employee) => {
    setSelectedEmployeeForDetails(employee);
    setIsEmployeeDetailsModalOpen(true);
  };

  const handleCloseEmployeeDetailsModal = () => {
    setIsEmployeeDetailsModalOpen(false);
    setSelectedEmployeeForDetails(null);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Employee Management</CardTitle>
        <Button
          onClick={() => handleOpenEmployeeFormModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </Button>
      </CardHeader>
      <CardContent>
        {fetchingEmployees ? (
          <div className="flex justify-center items-center min-h-[100px]">
            <LoadingSpinner size={30} />
          </div>
        ) : employees.length === 0 ? (
          <p className="text-gray-600">No employees found.</p>
        ) : (
          <EmployeeTable
            employees={employees}
            onOpenEditModal={handleOpenEmployeeFormModal}
            onDeleteEmployee={handleDeleteEmployee}
            onOpenEmployeeDetailsModal={handleOpenEmployeeDetailsModal}
            loadingAction={loadingAction}
          />
        )}

        <EmployeeFormModal
          isOpen={isEmployeeFormModalOpen}
          onClose={handleCloseEmployeeFormModal}
          currentEmployee={currentEmployeeForForm}
          onSubmit={handleEmployeeFormSubmit}
          loading={loadingAction}
        />

        <EmployeeDetailsModal
          isOpen={isEmployeeDetailsModalOpen}
          onClose={handleCloseEmployeeDetailsModal}
          employee={selectedEmployeeForDetails}
        />
      </CardContent>
    </Card>
  );
};

export default AdminEmployees;