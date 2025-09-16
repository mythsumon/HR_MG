'use client';

import React from 'react';
import Layout from '@/components/Layout';

export default function ReportsPage() {
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
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🥧</div>
                  <p className="text-gray-500">Chart placeholder - Pie chart</p>
                </div>
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
          </div>
        </div>
    </Layout>
  );
}