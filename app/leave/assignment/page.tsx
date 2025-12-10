'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';

interface Employee {
  id: string;
  name: string;
  department: string;
  team: string;
  email: string;
  joinDate: string;
}

interface LeaveType {
  id: string;
  name: string;
  description: string;
  defaultDays: number;
  maxDays: number;
  isUnlimited: boolean;
  isActive: boolean;
  color: string;
}

interface EmployeeLeaveAssignment {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface BulkAssignment {
  employeeId: string;
  assignments: {
    leaveTypeId: string;
    allocatedDays: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isSelected: boolean; // New property to track selection
  }[];
}

export default function LeaveAssignmentPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'E001', name: 'John Smith', department: 'Engineering', team: 'Frontend', email: 'john@company.com', joinDate: '2022-03-15' },
    { id: 'E002', name: 'Sarah Johnson', department: 'Marketing', team: 'Digital', email: 'sarah@company.com', joinDate: '2021-07-22' },
    { id: 'E003', name: 'Michael Chen', department: 'Engineering', team: 'Backend', email: 'michael@company.com', joinDate: '2023-01-10' },
    { id: 'E004', name: 'Emily Davis', department: 'HR', team: 'Recruitment', email: 'emily@company.com', joinDate: '2020-11-05' },
    { id: 'E005', name: 'Robert Wilson', department: 'Finance', team: 'Accounting', email: 'robert@company.com', joinDate: '2022-09-18' }
  ]);

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    {
      id: 'LT001',
      name: 'Annual Leave',
      description: 'Paid time off for vacation and personal use',
      defaultDays: 15,
      maxDays: 25,
      isUnlimited: false,
      isActive: true,
      color: 'blue'
    },
    {
      id: 'LT002',
      name: 'Sick Leave',
      description: 'Paid time off for illness or medical appointments',
      defaultDays: 10,
      maxDays: 15,
      isUnlimited: false,
      isActive: true,
      color: 'red'
    },
    {
      id: 'LT003',
      name: 'Unpaid Leave',
      description: 'Unpaid time off for personal reasons',
      defaultDays: 0,
      maxDays: 0,
      isUnlimited: true,
      isActive: true,
      color: 'gray'
    },
    {
      id: 'LT004',
      name: 'Maternity Leave',
      description: 'Leave for childbirth and bonding',
      defaultDays: 90,
      maxDays: 90,
      isUnlimited: false,
      isActive: true,
      color: 'pink'
    }
  ]);

  const [assignments, setAssignments] = useState<EmployeeLeaveAssignment[]>([
    {
      id: 'A001',
      employeeId: 'E001',
      leaveTypeId: 'LT001',
      allocatedDays: 15,
      usedDays: 5,
      remainingDays: 10,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true
    },
    {
      id: 'A002',
      employeeId: 'E001',
      leaveTypeId: 'LT002',
      allocatedDays: 10,
      usedDays: 2,
      remainingDays: 8,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [bulkAssignment, setBulkAssignment] = useState<BulkAssignment>({
    employeeId: '',
    assignments: leaveTypes.map(leaveType => ({
      leaveTypeId: leaveType.id,
      allocatedDays: leaveType.defaultDays,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true,
      isSelected: true // By default, all leave types are selected
    }))
  });

  const [filters, setFilters] = useState({
    department: 'all',
    team: 'all',
    leaveType: 'all',
    status: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Get departments and teams for filters
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const teams = Array.from(new Set(employees.map(emp => emp.team)));

  // Handle bulk assignment input changes
  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = e.target.value;
    setBulkAssignment(prev => ({
      ...prev,
      employeeId
    }));
  };

  // Handle leave type assignment changes
  const handleLeaveTypeChange = (index: number, field: string, value: string | number | boolean) => {
    setBulkAssignment(prev => {
      const newAssignments = [...prev.assignments];
      newAssignments[index] = {
        ...newAssignments[index],
        [field]: value
      };
      return {
        ...prev,
        assignments: newAssignments
      };
    });
  };

  // Handle leave type selection toggle
  const toggleLeaveTypeSelection = (index: number) => {
    setBulkAssignment(prev => {
      const newAssignments = [...prev.assignments];
      newAssignments[index] = {
        ...newAssignments[index],
        isSelected: !newAssignments[index].isSelected
      };
      return {
        ...prev,
        assignments: newAssignments
      };
    });
  };

  // Handle bulk form submission
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate employee selection
    if (!bulkAssignment.employeeId) {
      alert('Please select an employee');
      return;
    }
    
    // Create assignments for each SELECTED leave type
    const newAssignments: EmployeeLeaveAssignment[] = [];
    let assignmentCounter = assignments.length + 1;
    
    bulkAssignment.assignments.forEach(assignment => {
      // Only create assignment if:
      // 1. The leave type is selected
      // 2. Allocated days > 0
      if (assignment.isSelected && assignment.allocatedDays > 0) {
        const leaveType = leaveTypes.find(lt => lt.id === assignment.leaveTypeId);
        if (leaveType) {
          newAssignments.push({
            id: 'A' + assignmentCounter.toString().padStart(3, '0'),
            employeeId: bulkAssignment.employeeId,
            leaveTypeId: assignment.leaveTypeId,
            allocatedDays: assignment.allocatedDays,
            usedDays: 0,
            remainingDays: assignment.allocatedDays,
            startDate: assignment.startDate,
            endDate: assignment.endDate,
            isActive: assignment.isActive
          });
          assignmentCounter++;
        }
      }
    });
    
    if (newAssignments.length === 0) {
      alert('Please select at least one leave type and allocate days > 0');
      return;
    }
    
    // Add new assignments to state
    setAssignments(prev => [...prev, ...newAssignments]);
    
    // Close modal and reset form
    setShowModal(false);
    resetBulkForm();
  };

  // Reset bulk form
  const resetBulkForm = () => {
    setBulkAssignment({
      employeeId: '',
      assignments: leaveTypes.map(leaveType => ({
        leaveTypeId: leaveType.id,
        allocatedDays: leaveType.defaultDays,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        isActive: true,
        isSelected: true // Reset to all selected
      }))
    });
  };

  // Delete assignment
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave assignment?')) {
      setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    }
  };

  // Toggle active status
  const toggleActiveStatus = (id: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, isActive: !assignment.isActive } : assignment
    ));
  };

  // Get color class for leave type
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      case 'pink': return 'bg-pink-500';
      case 'indigo': return 'bg-indigo-500';
      case 'gray': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Filter assignments and then group by employee
  const filteredAssignments = assignments.filter(assignment => {
    // Apply filters
    if (filters.department !== 'all') {
      const employee = employees.find(emp => emp.id === assignment.employeeId);
      if (!employee || employee.department !== filters.department) return false;
    }
    
    if (filters.team !== 'all') {
      const employee = employees.find(emp => emp.id === assignment.employeeId);
      if (!employee || employee.team !== filters.team) return false;
    }
    
    if (filters.leaveType !== 'all' && assignment.leaveTypeId !== filters.leaveType) return false;
    
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !assignment.isActive) return false;
      if (filters.status === 'inactive' && assignment.isActive) return false;
    }
    
    // Apply search term
    if (searchTerm) {
      const employee = employees.find(emp => emp.id === assignment.employeeId);
      const leaveType = leaveTypes.find(lt => lt.id === assignment.leaveTypeId);
      
      if (!employee || !leaveType) return false;
      
      const searchLower = searchTerm.toLowerCase();
      if (
        !employee.name.toLowerCase().includes(searchLower) &&
        !employee.department.toLowerCase().includes(searchLower) &&
        !employee.team.toLowerCase().includes(searchLower) &&
        !leaveType.name.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    return true;
  });

  // Group assignments by employee
  const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
    const employeeId = assignment.employeeId;
    if (!acc[employeeId]) {
      acc[employeeId] = {
        employee: employees.find(emp => emp.id === employeeId),
        assignments: []
      };
    }
    acc[employeeId].assignments.push(assignment);
    return acc;
  }, {} as Record<string, { employee: Employee | undefined; assignments: EmployeeLeaveAssignment[] }>);

  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown Employee';
  };

  // Get leave type name by ID
  const getLeaveTypeName = (id: string) => {
    const leaveType = leaveTypes.find(lt => lt.id === id);
    return leaveType ? leaveType.name : 'Unknown Leave Type';
  };

  // Get leave type color by ID
  const getLeaveTypeColor = (id: string) => {
    const leaveType = leaveTypes.find(lt => lt.id === id);
    return leaveType ? leaveType.color : 'gray';
  };

  // Reset all leave allocations to default values
  const handleAnnualRefresh = () => {
    if (window.confirm('Are you sure you want to reset all leave allocations to their default values? This will reset used days to 0 and restore allocated days to their original values.')) {
      // Get the current year for date updates
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;
      
      setAssignments(prev => prev.map(assignment => {
        const leaveType = leaveTypes.find(lt => lt.id === assignment.leaveTypeId);
        if (leaveType) {
          return {
            ...assignment,
            allocatedDays: leaveType.defaultDays,
            usedDays: 0,
            remainingDays: leaveType.defaultDays,
            startDate,
            endDate
          };
        }
        return assignment;
      }));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Assignment</h1>
            <p className="text-gray-600 dark:text-gray-400">Assign multiple leave types to employees in one operation</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleAnnualRefresh}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-medium">
              <span>↺</span>
              <span>Annual Refresh</span>
            </button>
            <button 
              onClick={() => {
                resetBulkForm();
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium">
              <span>+</span>
              <span>Bulk Assign Leave</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team
              </label>
              <select
                value={filters.team}
                onChange={(e) => setFilters({...filters, team: e.target.value})}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Leave Type
              </label>
              <select
                value={filters.leaveType}
                onChange={(e) => setFilters({...filters, leaveType: e.target.value})}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Leave Types</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assignments..."
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Leave Types
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(groupedAssignments).map(([employeeId, group]) => (
                  <tr key={employeeId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {group.employee?.name || 'Unknown Employee'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {group.employee?.department} - {group.employee?.team}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {group.assignments.map(assignment => {
                          const leaveType = leaveTypes.find(lt => lt.id === assignment.leaveTypeId);
                          return (
                            <span 
                              key={assignment.id} 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                assignment.isActive 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${getColorClass(leaveType?.color || 'gray')} mr-1`}></span>
                              {leaveType?.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {group.assignments.map(assignment => {
                          const leaveType = leaveTypes.find(lt => lt.id === assignment.leaveTypeId);
                          return (
                            <div key={assignment.id} className="text-sm">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {leaveType?.name}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {assignment.allocatedDays} days allocated ({assignment.usedDays} used, {assignment.remainingDays} remaining)
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {assignment.startDate} to {assignment.endDate}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            // Toggle active status for all assignments of this employee
                            group.assignments.forEach(assignment => {
                              toggleActiveStatus(assignment.id);
                            });
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
                          Toggle All
                        </button>
                        <button
                          onClick={() => {
                            // Delete all assignments for this employee
                            if (window.confirm(`Are you sure you want to delete all leave assignments for ${group.employee?.name}?`)) {
                              group.assignments.forEach(assignment => {
                                handleDelete(assignment.id);
                              });
                            }
                          }}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800">
                          Delete All
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">No leave assignments found</div>
              <button 
                onClick={() => {
                  resetBulkForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span>+</span>
                <span className="ml-2">Create First Assignment</span>
              </button>
            </div>
          )}
        </div>

        {/* Bulk Assignment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Bulk Assign Leave Types
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Assign multiple leave types to an employee in one operation
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      resetBulkForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleBulkSubmit} className="space-y-6">
                  {/* Employee Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employee *
                    </label>
                    <select
                      value={bulkAssignment.employeeId}
                      onChange={handleEmployeeChange}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      required>
                      <option value="">Select an employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.department} - {employee.team})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Leave Types Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Leave Types Allocation
                    </label>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {bulkAssignment.assignments.map((assignment, index) => {
                        const leaveType = leaveTypes.find(lt => lt.id === assignment.leaveTypeId);
                        if (!leaveType) return null;
                        
                        return (
                          <div key={leaveType.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-start mb-3">
                              <div className="flex items-center h-5 mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={assignment.isSelected}
                                  onChange={() => toggleLeaveTypeSelection(index)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                              </div>
                              <div className={`w-3 h-3 rounded-full ${getColorClass(leaveType.color)} ml-3 mt-1`}></div>
                              <h3 className="font-medium text-gray-900 dark:text-white ml-2">{leaveType.name}</h3>
                            </div>
                            
                            {assignment.isSelected && (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                      Allocated Days
                                    </label>
                                    <input
                                      type="number"
                                      value={assignment.allocatedDays}
                                      onChange={(e) => handleLeaveTypeChange(index, 'allocatedDays', parseInt(e.target.value) || 0)}
                                      min="0"
                                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
                                  </div>
                                  
                                  <div className="flex items-center mt-6">
                                    <input
                                      type="checkbox"
                                      checked={assignment.isActive}
                                      onChange={(e) => handleLeaveTypeChange(index, 'isActive', e.target.checked)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                      Active
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                  <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                      Start Date
                                    </label>
                                    <input
                                      type="date"
                                      value={assignment.startDate}
                                      onChange={(e) => handleLeaveTypeChange(index, 'startDate', e.target.value)}
                                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                      End Date
                                    </label>
                                    <input
                                      type="date"
                                      value={assignment.endDate}
                                      onChange={(e) => handleLeaveTypeChange(index, 'endDate', e.target.value)}
                                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetBulkForm();
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Assign Leave Types
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}