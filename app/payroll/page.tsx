'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HRPayrollManagement from './hr-payroll-management';

export default function PayrollPage() {
  const [userRole, setUserRole] = useState('employee');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'employee';
    setUserRole(role);
  }, []);

  // Show HR management view for managers
  if (userRole === 'manager') {
    return (
      <Layout>
        <HRPayrollManagement />
      </Layout>
    );
  }
  // Employee view
  return (
    <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage employee payroll and salary disbursement</p>
            </div>
            <a 
              href="/payroll/create" 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Create Payroll
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  💰
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Payroll</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$85,240</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  📊
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Employees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">124</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                  ⏳
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  ✅
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Processed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">116</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Payslip */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Current Payslip</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Download PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Earnings */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Earnings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Base Salary</span>
                    <span className="font-medium text-gray-900 dark:text-white">$5,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Overtime</span>
                    <span className="font-medium text-gray-900 dark:text-white">$320.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bonus</span>
                    <span className="font-medium text-gray-900 dark:text-white">$500.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-semibold dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Gross Pay</span>
                    <span className="text-gray-900 dark:text-white">$5,820.00</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Deductions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Income Tax</span>
                    <span className="font-medium text-red-600">-$1,280.40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Social Security</span>
                    <span className="font-medium text-red-600">-$360.84</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Health Insurance</span>
                    <span className="font-medium text-red-600">-$150.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-semibold dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Total Deductions</span>
                    <span className="text-red-600">-$1,791.24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Net Pay</span>
                <span className="text-3xl font-bold text-green-600">$4,028.76</span>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}