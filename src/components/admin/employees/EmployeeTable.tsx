"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Employee } from '../../../types/api';
import { Edit, Trash2, Eye } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onOpenEditModal: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onOpenEmployeeDetailsModal: (employee: Employee) => void;
  loadingAction: boolean;
}

const EmployeeTable = ({
  employees,
  onOpenEditModal,
  onDeleteEmployee,
  onOpenEmployeeDetailsModal,
  loadingAction,
}: EmployeeTableProps) => {
  return (
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
              <TableCell>{new Date(employee.hiredDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenEmployeeDetailsModal(employee)}
                  className="mr-2"
                  title="View Employee Details"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenEditModal(employee)}
                  className="mr-2"
                  disabled={loadingAction}
                >
                  <Edit size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteEmployee(employee.id)}
                  disabled={loadingAction}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;