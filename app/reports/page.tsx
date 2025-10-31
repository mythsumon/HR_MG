'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import data from services
import { SharedAttendanceService } from '@/services/AttendanceService';
import { mockEmployees } from '@/services/EmployeeData';

// Define types
interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'leave' | 'today' | 'weekend' | 'no-record' | 'late';
  clockIn?: string;
  clockOut?: string;
  workingHours?: string;
  location?: 'office' | 'remote' | 'client-site';
  gpsLocation?: string;
  notes?: string;
  overtimeHours?: number;
  isHalfDay?: boolean;
  hasMissingPunch?: boolean;
  workTimeline?: {
    expectedStart: string;
    expectedEnd: string;
    actualStart?: string;
    actualEnd?: string;
  };
}

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

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  team: string;
  leaveType: 'annual' | 'sick' | 'unpaid' | 'vacation';
  startDate: string;
  endDate: string;
  duration: number;
  halfDay?: 'am' | 'pm';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string;
  requestedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
}

// Mock data for payroll and leave (in a real app, this would come from services)
const mockPayrollEmployees: PayrollEmployee[] = [
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

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'L001', employeeId: 'E123', employeeName: 'John Kim', department: 'Engineering', team: 'Frontend',
    leaveType: 'annual', startDate: '2025-09-15', endDate: '2025-09-18', duration: 4, halfDay: 'am',
    status: 'approved', reason: 'Annual leave', requestedOn: '2025-09-01'
  },
  {
    id: 'L002', employeeId: 'E214', employeeName: 'Sara Lee', department: 'Marketing', team: 'Digital',
    leaveType: 'sick', startDate: '2025-09-16', endDate: '2025-09-17', duration: 2,
    status: 'approved', reason: 'Medical appointment', requestedOn: '2025-09-15'
  },
  {
    id: 'L003', employeeId: 'E214', employeeName: 'Sara Lee', department: 'Marketing', team: 'Digital',
    leaveType: 'vacation', startDate: '2025-09-19', endDate: '2025-09-19', duration: 1,
    status: 'pending', reason: 'Vacation', requestedOn: '2025-09-12'
  },
  {
    id: 'L004', employeeId: 'E331', employeeName: 'David Park', department: 'Engineering', team: 'Backend',
    leaveType: 'unpaid', startDate: '2025-09-22', endDate: '2025-09-23', duration: 2,
    status: 'approved', reason: 'Personal matter', requestedOn: '2025-09-20'
  },
  {
    id: 'L005', employeeId: 'E445', employeeName: 'Lisa Chen', department: 'Design', team: 'UX/UI',
    leaveType: 'vacation', startDate: '2025-09-10', endDate: '2025-09-12', duration: 3,
    status: 'rejected', reason: 'Team meeting conflict', requestedOn: '2025-09-05'
  }
];

export default function ReportsPage() {
  const [activeFormula, setActiveFormula] = useState<string | null>(null);

  const toggleFormula = (section: string) => {
    setActiveFormula(activeFormula === section ? null : section);
  };

  // Export Attendance Data to Excel
  const exportAttendanceToExcel = () => {
    try {
      // Get attendance data
      const attendanceService = SharedAttendanceService.getInstance();
      const attendanceData = attendanceService.getAllAttendanceData();
      
      // Prepare data for export
      const data = Object.values(attendanceData).map((record: AttendanceRecord) => ({
        Date: record.date,
        Status: record.status,
        'Clock In': record.clockIn || '',
        'Clock Out': record.clockOut || '',
        'Working Hours': record.workingHours || '',
        Location: record.location || '',
        'GPS Location': record.gpsLocation || '',
        Notes: record.notes || '',
        'Overtime Hours': record.overtimeHours || 0
      }));
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
      
      // Export to file
      XLSX.writeFile(wb, `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting attendance to Excel:', error);
      alert('Error exporting attendance data to Excel');
    }
  };

  // Export Attendance Data to PDF
  const exportAttendanceToPDF = () => {
    try {
      // Get attendance data
      const attendanceService = SharedAttendanceService.getInstance();
      const attendanceData = attendanceService.getAllAttendanceData();
      
      // Prepare data for export
      const data = Object.values(attendanceData).map((record: AttendanceRecord) => [
        record.date,
        record.status,
        record.clockIn || '',
        record.clockOut || '',
        record.workingHours || '',
        record.location || '',
        record.notes || ''
      ]);
      
      // Create PDF
      const doc = new jsPDF() as any;
      
      // Add title
      doc.setFontSize(18);
      doc.text('Attendance Report', 14, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add table
      autoTable(doc, {
        head: [['Date', 'Status', 'Clock In', 'Clock Out', 'Working Hours', 'Location', 'Notes']],
        body: data,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Save PDF
      doc.save(`attendance_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting attendance to PDF:', error);
      alert('Error exporting attendance data to PDF');
    }
  };

  // Export Payroll Data to Excel
  const exportPayrollToExcel = () => {
    try {
      // Prepare payroll data for export
      const data = mockPayrollEmployees.map((employee: PayrollEmployee) => ({
        'Employee ID': employee.id,
        'Employee Name': employee.name,
        Department: employee.department,
        Role: employee.role,
        'Employment Type': employee.employmentType,
        'Base Salary': employee.baseSalary,
        Overtime: employee.overtime,
        'Overtime Hours': employee.overtimeHours,
        Allowances: employee.allowances.reduce((sum, item) => sum + item.amount, 0),
        Deductions: employee.deductions.reduce((sum, item) => sum + item.amount, 0),
        'Net Pay': employee.netPay,
        Status: employee.status,
        'Pay Date': employee.payDate
      }));
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Payroll Report');
      
      // Export to file
      XLSX.writeFile(wb, `payroll_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting payroll to Excel:', error);
      alert('Error exporting payroll data to Excel');
    }
  };

  // Export Payroll Data to PDF
  const exportPayrollToPDF = () => {
    try {
      // Prepare payroll data for export
      const data = mockPayrollEmployees.map((employee: PayrollEmployee) => [
        employee.id,
        employee.name,
        employee.department,
        employee.role,
        employee.employmentType,
        employee.baseSalary.toFixed(2),
        employee.overtime.toFixed(2),
        employee.netPay.toFixed(2),
        employee.status,
        employee.payDate
      ]);
      
      // Create PDF
      const doc = new jsPDF() as any;
      
      // Add title
      doc.setFontSize(18);
      doc.text('Payroll Report', 14, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add table
      autoTable(doc, {
        head: [['ID', 'Name', 'Department', 'Role', 'Type', 'Base Salary', 'Overtime', 'Net Pay', 'Status', 'Pay Date']],
        body: data,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Save PDF
      doc.save(`payroll_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting payroll to PDF:', error);
      alert('Error exporting payroll data to PDF');
    }
  };

  // Export Leave Data to Excel
  const exportLeaveToExcel = () => {
    try {
      // Prepare leave data for export
      const data = mockLeaveRequests.map((request: LeaveRequest) => ({
        'Request ID': request.id,
        'Employee ID': request.employeeId,
        'Employee Name': request.employeeName,
        Department: request.department,
        Team: request.team,
        'Leave Type': request.leaveType,
        'Start Date': request.startDate,
        'End Date': request.endDate,
        Duration: request.duration,
        Status: request.status,
        Reason: request.reason,
        'Requested On': request.requestedOn,
        'Approved By': request.approvedBy || '',
        'Approved On': request.approvedOn || '',
        'Rejection Reason': request.rejectionReason || ''
      }));
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leave Report');
      
      // Export to file
      XLSX.writeFile(wb, `leave_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting leave to Excel:', error);
      alert('Error exporting leave data to Excel');
    }
  };

  // Export Leave Data to PDF
  const exportLeaveToPDF = () => {
    try {
      // Prepare leave data for export
      const data = mockLeaveRequests.map((request: LeaveRequest) => [
        request.id,
        request.employeeName,
        request.department,
        request.leaveType,
        request.startDate,
        request.endDate,
        request.duration.toString(),
        request.status,
        request.reason
      ]);
      
      // Create PDF
      const doc = new jsPDF() as any;
      
      // Add title
      doc.setFontSize(18);
      doc.text('Leave Requests Report', 14, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add table
      autoTable(doc, {
        head: [['ID', 'Employee', 'Department', 'Type', 'Start Date', 'End Date', 'Duration', 'Status', 'Reason']],
        body: data,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Save PDF
      doc.save(`leave_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting leave to PDF:', error);
      alert('Error exporting leave data to PDF');
    }
  };

  // Export Employee Data to Excel
  const exportEmployeesToExcel = () => {
    try {
      // Prepare employee data for export
      const data = mockEmployees.map((employee: any) => ({
        'Employee ID': `EMP${employee.id.toString().padStart(3, '0')}`,
        'Full Name': employee.name,
        Email: employee.email,
        Department: employee.department,
        Position: employee.position,
        Status: employee.status,
        'Join Date': employee.joinDate
      }));
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
      
      // Export to file
      XLSX.writeFile(wb, `employee_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting employees to Excel:', error);
      alert('Error exporting employee data to Excel');
    }
  };

  // Export Employee Data to PDF
  const exportEmployeesToPDF = () => {
    try {
      // Prepare employee data for export
      const data = mockEmployees.map((employee: any) => [
        `EMP${employee.id.toString().padStart(3, '0')}`,
        employee.name,
        employee.email,
        employee.department,
        employee.position,
        employee.status,
        employee.joinDate
      ]);
      
      // Create PDF
      const doc = new jsPDF() as any;
      
      // Add title
      doc.setFontSize(18);
      doc.text('Employee Report', 14, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add table
      autoTable(doc, {
        head: [['ID', 'Name', 'Email', 'Department', 'Position', 'Status', 'Join Date']],
        body: data,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Save PDF
      doc.save(`employee_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting employees to PDF:', error);
      alert('Error exporting employee data to PDF');
    }
  };

  return (
    <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">Generate insights from your HR data</p>
            </div>
            <div className="flex space-x-3">
              <div className="relative group">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <span>Export Excel</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <button 
                    onClick={exportAttendanceToExcel}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Attendance Report
                  </button>
                  <button 
                    onClick={exportPayrollToExcel}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Payroll Report
                  </button>
                  <button 
                    onClick={exportLeaveToExcel}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Leave Report
                  </button>
                  <button 
                    onClick={exportEmployeesToExcel}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Employee Report
                  </button>
                </div>
              </div>
              <div className="relative group">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                  <span>Export PDF</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <button 
                    onClick={exportAttendanceToPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Attendance Report
                  </button>
                  <button 
                    onClick={exportPayrollToPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Payroll Report
                  </button>
                  <button 
                    onClick={exportLeaveToPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Leave Report
                  </button>
                  <button 
                    onClick={exportEmployeesToPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Employee Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  ⏰
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Attendance Reports</h3>
              </div>
              <p className="text-gray-600 mb-4">Track employee attendance patterns and trends</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Daily attendance summary</li>
                <li>• Monthly attendance trends</li>
                <li>• Late arrival analytics</li>
                <li>• Absence patterns</li>
              </ul>
              
              {/* Formula UI for Attendance Reports */}
              <div className="mt-4">
                <button 
                  onClick={() => toggleFormula('attendance')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {activeFormula === 'attendance' ? 'Hide Formulas' : 'Show Formulas'}
                </button>
                
                {activeFormula === 'attendance' && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs">
                    <h4 className="font-semibold text-gray-900 mb-2">Calculation Formulas:</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-gray-800">Attendance Rate:</p>
                        <p className="text-gray-600">(Present Days / Total Working Days) × 100</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Working Hours:</p>
                        <p className="text-gray-600">(Clock Out Time - Clock In Time) in minutes → converted to hours</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Late Arrival Rate:</p>
                        <p className="text-gray-600">(Late Arrivals / Total Working Days) × 100</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-50 text-green-600">
                  👥
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Employee Reports</h3>
              </div>
              <p className="text-gray-600 mb-4">Analyze employee distribution and demographics</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Department distribution</li>
                <li>• Employee turnover rates</li>
                <li>• New hire analytics</li>
                <li>• Performance metrics</li>
              </ul>
              
              {/* Formula UI for Employee Reports */}
              <div className="mt-4">
                <button 
                  onClick={() => toggleFormula('employee')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {activeFormula === 'employee' ? 'Hide Formulas' : 'Show Formulas'}
                </button>
                
                {activeFormula === 'employee' && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs">
                    <h4 className="font-semibold text-gray-900 mb-2">Calculation Formulas:</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-gray-800">Turnover Rate:</p>
                        <p className="text-gray-600">(Employees Left / Average Employees) × 100</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Department Distribution:</p>
                        <p className="text-gray-600">(Employees in Department / Total Employees) × 100</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">New Hire Rate:</p>
                        <p className="text-gray-600">(New Hires in Period / Total Employees at Start) × 100</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                  💰
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Payroll Reports</h3>
              </div>
              <p className="text-gray-600 mb-4">Financial insights and payroll analytics</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Salary distribution</li>
                <li>• Department costs</li>
                <li>• Overtime analysis</li>
                <li>• Tax summaries</li>
              </ul>
              
              {/* Formula UI for Payroll Reports */}
              <div className="mt-4">
                <button 
                  onClick={() => toggleFormula('payroll')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {activeFormula === 'payroll' ? 'Hide Formulas' : 'Show Formulas'}
                </button>
                
                {activeFormula === 'payroll' && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs">
                    <h4 className="font-semibold text-gray-900 mb-2">Calculation Formulas:</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-gray-800">Gross Pay:</p>
                        <p className="text-gray-600">Base Salary + Overtime Pay + Allowances</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Net Pay:</p>
                        <p className="text-gray-600">Gross Pay - Deductions</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Overtime Pay:</p>
                        <p className="text-gray-600">Overtime Hours × Overtime Rate</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Department Cost:</p>
                        <p className="text-gray-600">Sum of All Employee Net Pay in Department</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sample Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend (Last 7 Days)</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-500">Chart placeholder - Attendance trends</p>
                </div>
              </div>
              
              {/* Formula UI for Attendance Chart */}
              <div className="mt-4">
                <button 
                  onClick={() => toggleFormula('attendanceChart')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {activeFormula === 'attendanceChart' ? 'Hide Formula' : 'Show Formula'}
                </button>
                
                {activeFormula === 'attendanceChart' && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs">
                    <h4 className="font-semibold text-gray-900 mb-2">Data Calculation:</h4>
                    <p className="text-gray-600">Daily Attendance Rate = (Present Employees / Total Active Employees) × 100</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🥧</div>
                  <p className="text-gray-500">Chart placeholder - Pie chart</p>
                </div>
              </div>
              
              {/* Formula UI for Department Chart */}
              <div className="mt-4">
                <button 
                  onClick={() => toggleFormula('departmentChart')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {activeFormula === 'departmentChart' ? 'Hide Formula' : 'Show Formula'}
                </button>
                
                {activeFormula === 'departmentChart' && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs">
                    <h4 className="font-semibold text-gray-900 mb-2">Data Calculation:</h4>
                    <p className="text-gray-600">Department Percentage = (Employees in Department / Total Employees) × 100</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">95.2%</p>
                <p className="text-sm text-gray-600">Attendance Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">$85K</p>
                <p className="text-sm text-gray-600">Avg Monthly Payroll</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">8</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">2.1%</p>
                <p className="text-sm text-gray-600">Turnover Rate</p>
              </div>
            </div>
            
            {/* Formula UI for Key Metrics */}
            <div className="mt-6">
              <button 
                onClick={() => toggleFormula('keyMetrics')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {activeFormula === 'keyMetrics' ? 'Hide Calculation Formulas' : 'Show Calculation Formulas'}
              </button>
              
              {activeFormula === 'keyMetrics' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Metrics Calculation:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-800">Attendance Rate:</p>
                      <p className="text-gray-600 mb-2">(Total Present Days / Total Working Days) × 100</p>
                      <p className="text-gray-500">Example: (190 / 200) × 100 = 95%</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Average Monthly Payroll:</p>
                      <p className="text-gray-600 mb-2">Total Monthly Payroll / Number of Employees</p>
                      <p className="text-gray-500">Example: $1,700,000 / 20 = $85,000</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Departments:</p>
                      <p className="text-gray-600 mb-2">Count of Unique Departments</p>
                      <p className="text-gray-500">Example: Engineering, Marketing, HR, etc. = 8</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Turnover Rate:</p>
                      <p className="text-gray-600 mb-2">(Employees Who Left / Average Employees) × 100</p>
                      <p className="text-gray-500">Example: (4 / 190) × 100 = 2.1%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </Layout>
  );
}