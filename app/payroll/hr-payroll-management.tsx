'use client';

import React, { useState, useEffect } from 'react';

interface PayrollEmployee {
  id: string;
  name: string;
  department: string;
  role: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  baseSalary: number;
  overtime: number;
  overtimeHours: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  netPay: number;
  status: 'pending' | 'approved' | 'locked' | 'paid';
  bankAccount: string;
  payDate: string;
}

export default function HRPayrollManagement() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showPayslipDrawer, setShowPayslipDrawer] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollEmployee | null>(null);
  const [showHRPayslip, setShowHRPayslip] = useState(false);

  // Mock data
  const mockEmployees: PayrollEmployee[] = [
    {
      id: 'E123', name: 'John Kim', department: 'Engineering', role: 'Senior Developer',
      employmentType: 'full-time', baseSalary: 7500, overtime: 320, overtimeHours: 8,
      allowances: [{ name: 'Transport', amount: 200 }, { name: 'Meal', amount: 150 }],
      deductions: [{ name: 'Income Tax', amount: 1650 }, { name: 'Social Security', amount: 525 }],
      netPay: 5845, status: 'approved', bankAccount: '****1234', payDate: '2025-09-30'
    },
    {
      id: 'E214', name: 'Sara Lee', department: 'Marketing', role: 'Marketing Manager',
      employmentType: 'full-time', baseSalary: 6500, overtime: 0, overtimeHours: 0,
      allowances: [{ name: 'Car Allowance', amount: 500 }],
      deductions: [{ name: 'Income Tax', amount: 1470 }, { name: 'Health Insurance', amount: 150 }],
      netPay: 5025, status: 'pending', bankAccount: '****5678', payDate: '2025-09-30'
    },
    {
      id: 'E331', name: 'David Park', department: 'Engineering', role: 'DevOps Engineer',
      employmentType: 'full-time', baseSalary: 7000, overtime: 480, overtimeHours: 12,
      allowances: [{ name: 'On-call', amount: 300 }],
      deductions: [{ name: 'Income Tax', amount: 1596 }, { name: 'Social Security', amount: 546 }],
      netPay: 5688, status: 'locked', bankAccount: '****9012', payDate: '2025-09-30'
    }
  ];

  const hrPayslip = {
    name: 'Sarah Johnson', department: 'Human Resources', role: 'HR Manager',
    baseSalary: 8000, overtime: 0,
    allowances: [{ name: 'Management Allowance', amount: 800 }, { name: 'Transport', amount: 300 }],
    deductions: [{ name: 'Income Tax', amount: 1980 }, { name: 'Social Security', amount: 637 }],
    netPay: 6283, bankAccount: '****7890', payDate: '2025-09-30'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEmployees = mockEmployees.filter(employee => {
    if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) return false;
    if (selectedStatus !== 'all' && employee.status !== selectedStatus) return false;
    if (searchTerm && !employee.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalAllowances = (allowances: { amount: number }[]) => allowances.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = (deductions: { amount: number }[]) => deductions.reduce((sum, item) => sum + item.amount, 0);

  const totals = filteredEmployees.reduce((acc, emp) => ({
    baseSalary: acc.baseSalary + emp.baseSalary,
    overtime: acc.overtime + emp.overtime,
    allowances: acc.allowances + totalAllowances(emp.allowances),
    deductions: acc.deductions + totalDeductions(emp.deductions),
    netPay: acc.netPay + emp.netPay
  }), { baseSalary: 0, overtime: 0, allowances: 0, deductions: 0, netPay: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage employee payroll and salary disbursement</p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/payroll/create"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            + Create Payroll
          </a>
          <button
            onClick={() => setShowHRPayslip(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            My Payslip
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Sep 2025 • Monthly</option>
          </select>
          <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Open</option>
            <option>Locked</option>
            <option>Processed</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Department ▾</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">CSV</button>
            <button className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">PDF</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">💰</div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$485,200</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">👥</div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Employees in Run</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">124</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">⏳</div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">✅</div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Processed / Paid</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">116</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Payroll</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dept / Role</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Base</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Overtime</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Allowances</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Deductions</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Net Pay</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4"><input type="checkbox" className="rounded" /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm mr-3">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{employee.department}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{employee.role}</div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-green-600">{formatCurrency(employee.baseSalary)}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-green-600">{formatCurrency(employee.overtime)}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-green-600">{formatCurrency(totalAllowances(employee.allowances))}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-red-600">-{formatCurrency(totalDeductions(employee.deductions))}</td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(employee.netPay)}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => { setSelectedEmployee(employee); setShowPayslipDrawer(true); }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">Approve</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Totals</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-green-600">{formatCurrency(totals.baseSalary)}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-green-600">{formatCurrency(totals.overtime)}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-green-600">{formatCurrency(totals.allowances)}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-red-600">-{formatCurrency(totals.deductions)}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(totals.netPay)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payslip Drawer */}
      {showPayslipDrawer && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50" onClick={() => setShowPayslipDrawer(false)}>
          <div className="bg-white dark:bg-gray-800 w-96 h-full overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.id} • {selectedEmployee.department}</p>
                </div>
                <button onClick={() => setShowPayslipDrawer(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Base Salary</span><span className="text-green-600">{formatCurrency(selectedEmployee.baseSalary)}</span></div>
                    <div className="flex justify-between"><span>Overtime</span><span className="text-green-600">{formatCurrency(selectedEmployee.overtime)}</span></div>
                    {selectedEmployee.allowances.map((item, idx) => (
                      <div key={idx} className="flex justify-between"><span>{item.name}</span><span className="text-green-600">{formatCurrency(item.amount)}</span></div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deductions</h3>
                  <div className="space-y-2">
                    {selectedEmployee.deductions.map((item, idx) => (
                      <div key={idx} className="flex justify-between"><span>{item.name}</span><span className="text-red-600">-{formatCurrency(item.amount)}</span></div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Net Pay</span>
                    <span className="text-green-600">{formatCurrency(selectedEmployee.netPay)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Approve</button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Download PDF</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR Payslip Modal */}
      {showHRPayslip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowHRPayslip(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Payslip</h2>
                  <p className="text-gray-600 dark:text-gray-400">{hrPayslip.name} • {hrPayslip.department}</p>
                </div>
                <button onClick={() => setShowHRPayslip(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Base Salary</span><span className="text-green-600">{formatCurrency(hrPayslip.baseSalary)}</span></div>
                    {hrPayslip.allowances.map((item, idx) => (
                      <div key={idx} className="flex justify-between"><span>{item.name}</span><span className="text-green-600">{formatCurrency(item.amount)}</span></div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deductions</h3>
                  <div className="space-y-2">
                    {hrPayslip.deductions.map((item, idx) => (
                      <div key={idx} className="flex justify-between"><span>{item.name}</span><span className="text-red-600">-{formatCurrency(item.amount)}</span></div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Net Pay</span>
                    <span className="text-green-600">{formatCurrency(hrPayslip.netPay)}</span>
                  </div>
                </div>
                
                <button className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}