'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';

export default function ReportsPage() {
  const [activeFormula, setActiveFormula] = useState<string | null>(null);

  const toggleFormula = (section: string) => {
    setActiveFormula(activeFormula === section ? null : section);
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
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Export Excel
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Export PDF
              </button>
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