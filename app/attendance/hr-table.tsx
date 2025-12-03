'use client';

import React, { useState } from 'react';
import Pagination from '@/components/Pagination';

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  avatar: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'late' | 'absent' | 'leave' | 'weekend';
  checkIn?: string;
  checkOut?: string;
}

const HRAttendanceTable: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'analytics'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const employees: Employee[] = [
    { id: '1', name: 'John Kim', department: 'Backend', role: 'Senior Developer', avatar: 'JK' },
    { id: '2', name: 'Sara Lee', department: 'Finance', role: 'Analyst', avatar: 'SL' },
    { id: '3', name: 'David Park', department: 'Design', role: 'UI Designer', avatar: 'DP' },
    { id: '4', name: 'Emily Chen', department: 'Frontend', role: 'React Developer', avatar: 'EC' },
    { id: '5', name: 'Mike Johnson', department: 'Backend', role: 'DevOps Engineer', avatar: 'MJ' },
    { id: '6', name: 'Lisa Wang', department: 'Design', role: 'UX Designer', avatar: 'LW' }
  ];

  const generateAttendanceData = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    
    return employees.map(employee => {
      const records: { [date: string]: AttendanceRecord } = {};
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (date.getDay() === 0 || date.getDay() === 6) {
          records[dateStr] = { date: dateStr, status: 'weekend' };
          continue;
        }
        
        const random = Math.random();
        if (random < 0.1) {
          records[dateStr] = { date: dateStr, status: 'absent' };
        } else if (random < 0.2) {
          records[dateStr] = { date: dateStr, status: 'leave' };
        } else if (random < 0.35) {
          records[dateStr] = { date: dateStr, status: 'late', checkIn: '09:20', checkOut: '18:00' };
        } else {
          records[dateStr] = { date: dateStr, status: 'present', checkIn: '09:05', checkOut: '18:05' };
        }
      }
      return { employee, records };
    });
  };

  const attendanceData = generateAttendanceData();

  const getFilteredEmployees = () => {
    return attendanceData.filter(data => {
      const matchesDepartment = selectedDepartment === 'All' || data.employee.department === selectedDepartment;
      const matchesRole = selectedRole === 'All' || data.employee.role.includes(selectedRole);
      const matchesSearch = data.employee.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDepartment && matchesRole && matchesSearch;
    });
  };

  const getDateRange = () => {
    const dates = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'present': return { icon: '✅', color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'late': return { icon: '⏰', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
      case 'absent': return { icon: '❌', color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'leave': return { icon: '🌴', color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'weekend': return { icon: '🏠', color: 'text-gray-500', bgColor: 'bg-gray-50' };
      default: return { icon: '⬜', color: 'text-gray-400', bgColor: 'bg-gray-50' };
    }
  };

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];
  const roles = ['All', 'Developer', 'Designer', 'Analyst'];
  const filteredEmployees = getFilteredEmployees();
  const dateRangeArray = getDateRange();

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Employees Attendance</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage team attendance across departments</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
              📊 Export CSV
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              📋 Export Excel
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department ▾</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role ▾</label>
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range ▾</label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search (by name/ID)</label>
            <input
              type="text"
              placeholder="Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 min-w-[200px]">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                  Dept
                </th>
                {dateRangeArray.map((date, index) => (
                  <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[140px]">
                    {date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedEmployees.map((employeeData) => (
                <tr key={employeeData.employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{employeeData.employee.avatar}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{employeeData.employee.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{employeeData.employee.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                      {employeeData.employee.department}
                    </span>
                  </td>
                  {dateRangeArray.map((date, dateIndex) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const record = employeeData.records[dateStr];
                    const statusDisplay = getStatusDisplay(record?.status || 'no-record');
                    
                    return (
                      <td key={dateIndex} className="px-4 py-4 text-center">
                        {record ? (
                          <div className={`inline-flex flex-col items-center p-2 rounded-lg border ${statusDisplay.bgColor} border-gray-200 min-w-[120px]`}>
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-lg">{statusDisplay.icon}</span>
                              <span className={`text-xs font-medium ${statusDisplay.color}`}>
                                {record.status === 'present' ? 'Present' :
                                 record.status === 'late' ? 'Late' :
                                 record.status === 'absent' ? 'Absent' :
                                 record.status === 'leave' ? 'Leave' :
                                 record.status === 'weekend' ? 'Closed' : ''}
                              </span>
                            </div>
                            {record.checkIn && record.checkOut && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {record.checkIn}–{record.checkOut}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-400 dark:text-gray-500 text-sm">–</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
        {filteredEmployees.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredEmployees.length}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default HRAttendanceTable;
