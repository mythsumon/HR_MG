'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';

interface Notice {
  id: number;
  title: string;
  content: string;
  category: 'company' | 'hr' | 'policy' | 'update';
  priority: 'low' | 'medium' | 'high';
  author: string;
  date: string;
  isRead: boolean;
  isPinned: boolean;
}

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: 'Updated Remote Work Policy',
      content: 'We have updated our remote work policy to include new guidelines for hybrid work arrangements. All employees should review the updated policy document by the end of this week.',
      category: 'policy',
      priority: 'high',
      author: 'HR Department',
      date: '2024-09-18',
      isRead: false,
      isPinned: true
    },
    {
      id: 2,
      title: 'Company Holiday Schedule 2024',
      content: 'Please find attached the official company holiday schedule for the remainder of 2024. Note the additional floating holiday on December 24th.',
      category: 'company',
      priority: 'medium',
      author: 'Sarah Johnson',
      date: '2024-09-17',
      isRead: true,
      isPinned: true
    },
    {
      id: 3,
      title: 'New Health Insurance Benefits',
      content: 'We are pleased to announce enhanced health insurance coverage starting October 1st. Information sessions will be held next week.',
      category: 'hr',
      priority: 'medium',
      author: 'HR Department',
      date: '2024-09-16',
      isRead: false,
      isPinned: false
    },
    {
      id: 4,
      title: 'IT Security Training Mandatory',
      content: 'All employees must complete the cybersecurity training module by September 30th. This is a mandatory requirement for all staff.',
      category: 'update',
      priority: 'high',
      author: 'IT Security Team',
      date: '2024-09-15',
      isRead: true,
      isPinned: false
    }
  ]);

  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const getCategoryColor = (category: Notice['category']) => {
    switch (category) {
      case 'company': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'hr': return 'bg-green-100 text-green-700 border-green-200';
      case 'policy': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'update': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Notice['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const markAsRead = (id: number) => {
    setNotices(prev => prev.map(notice => 
      notice.id === id ? { ...notice, isRead: true } : notice
    ));
  };

  const filteredNotices = notices.filter(notice => 
    filterCategory === 'all' || notice.category === filterCategory
  );

  const pinnedNotices = filteredNotices.filter(notice => notice.isPinned);
  const regularNotices = filteredNotices.filter(notice => !notice.isPinned);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-600">Company announcements, HR updates, and policy changes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All', icon: '📋' },
                { value: 'company', label: 'Company', icon: '🏢' },
                { value: 'hr', label: 'HR', icon: '👥' },
                { value: 'policy', label: 'Policy', icon: '📜' },
                { value: 'update', label: 'Updates', icon: '🔄' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterCategory(filter.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    filterCategory === filter.value
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pinned Notices */}
        {pinnedNotices.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📌</span>
              Pinned Announcements
            </h2>
            <div className="space-y-3">
              {pinnedNotices.map(notice => (
                <div
                  key={notice.id}
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
                    notice.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                    notice.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-green-500 bg-green-50'
                  }`}
                  onClick={() => {
                    setSelectedNotice(notice);
                    markAsRead(notice.id);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                        {!notice.isRead && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                        )}
                        <span className="text-yellow-500">📌</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{notice.content}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded-full border text-xs ${getCategoryColor(notice.category)}`}>
                          {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full border text-xs ${getPriorityColor(notice.priority)}`}>
                          {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                        </span>
                        <span className="text-gray-500">By {notice.author}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{new Date(notice.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Notices */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📢</span>
            Recent Announcements
          </h2>
          <div className="space-y-3">
            {regularNotices.map(notice => (
              <div
                key={notice.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => {
                  setSelectedNotice(notice);
                  markAsRead(notice.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      {!notice.isRead && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{notice.content}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full border text-xs ${getCategoryColor(notice.category)}`}>
                        {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full border text-xs ${getPriorityColor(notice.priority)}`}>
                        {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                      </span>
                      <span className="text-gray-500">By {notice.author}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{new Date(notice.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice Detail Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedNotice(null)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedNotice.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                    <span className={`px-2 py-1 rounded-full border text-xs ${getCategoryColor(selectedNotice.category)}`}>
                      {selectedNotice.category.charAt(0).toUpperCase() + selectedNotice.category.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full border text-xs ${getPriorityColor(selectedNotice.priority)}`}>
                      {selectedNotice.priority.charAt(0).toUpperCase() + selectedNotice.priority.slice(1)} Priority
                    </span>
                    {selectedNotice.isPinned && <span className="text-yellow-500">📌 Pinned</span>}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNotice(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl ml-4"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedNotice.content}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Published by {selectedNotice.author}</span>
                    <span>{new Date(selectedNotice.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}