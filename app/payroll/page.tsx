'use client';

import React from 'react';
import Layout from '@/components/Layout';

export default function PayrollPage() {
  return (
    <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600">Manage employee payroll and salary disbursement</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-50 text-green-600">
                  💰
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold text-gray-900">$85,240</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  📊
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">124</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                  ⏳
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                  ✅
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Processed</p>
                  <p className="text-2xl font-bold text-gray-900">116</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Payslip */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Current Payslip</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Download PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Earnings */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Earnings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Salary</span>
                    <span className="font-medium">$5,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime</span>
                    <span className="font-medium">$320.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonus</span>
                    <span className="font-medium">$500.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-semibold">
                    <span>Gross Pay</span>
                    <span>$5,820.00</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Deductions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-medium text-red-600">-$1,280.40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Social Security</span>
                    <span className="font-medium text-red-600">-$360.84</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Insurance</span>
                    <span className="font-medium text-red-600">-$150.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">-$1,791.24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Net Pay</span>
                <span className="text-3xl font-bold text-green-600">$4,028.76</span>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}