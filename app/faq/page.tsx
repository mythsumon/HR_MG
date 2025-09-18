'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'hr' | 'payroll' | 'it' | 'general';
  tags: string[];
  lastUpdated: string;
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: 'How do I apply for annual leave?',
      answer: 'To apply for annual leave, go to the Leave Requests section in the sidebar, click "Apply for Leave", select the dates and leave type, provide a reason, and submit. Your manager will receive a notification to approve or reject the request.',
      category: 'hr',
      tags: ['leave', 'vacation', 'time-off'],
      lastUpdated: '2024-09-15'
    },
    {
      id: 2,
      question: 'When is the payroll processed each month?',
      answer: 'Payroll is processed on the 25th of each month. If the 25th falls on a weekend or holiday, payroll will be processed on the preceding business day. Employees will receive their pay stubs via email 2 days before the payment date.',
      category: 'payroll',
      tags: ['salary', 'payment', 'schedule'],
      lastUpdated: '2024-09-10'
    },
    {
      id: 3,
      question: 'How do I reset my password?',
      answer: 'Click on the "Forgot Password" link on the login page, enter your email address, and follow the instructions sent to your email. If you continue to have issues, contact the IT department at it-support@company.com.',
      category: 'it',
      tags: ['password', 'login', 'account'],
      lastUpdated: '2024-09-12'
    },
    {
      id: 4,
      question: 'What are the company working hours?',
      answer: 'Standard working hours are Monday to Friday, 9:00 AM to 6:00 PM. However, we offer flexible working arrangements. Please discuss with your manager for any adjustments to your schedule.',
      category: 'general',
      tags: ['hours', 'schedule', 'flexibility'],
      lastUpdated: '2024-09-08'
    },
    {
      id: 5,
      question: 'How do I update my personal information?',
      answer: 'Go to Settings from the sidebar menu, click on "Personal Information", make the necessary changes, and save. For critical information like bank details, you may need HR approval.',
      category: 'hr',
      tags: ['profile', 'personal', 'information'],
      lastUpdated: '2024-09-14'
    },
    {
      id: 6,
      question: 'How do I claim expenses?',
      answer: 'Navigate to the Expense Claims section, upload your receipts, fill in the expense details, select the appropriate category, and submit for approval. Approved expenses are reimbursed with the next payroll.',
      category: 'payroll',
      tags: ['expenses', 'reimbursement', 'claims'],
      lastUpdated: '2024-09-11'
    },
    {
      id: 7,
      question: 'How do I report a technical issue?',
      answer: 'Use the Q&A/Helpdesk section to report technical issues, or send an email directly to it-support@company.com. Include detailed information about the problem and any error messages.',
      category: 'it',
      tags: ['support', 'technical', 'issue'],
      lastUpdated: '2024-09-13'
    },
    {
      id: 8,
      question: 'What benefits are available to employees?',
      answer: 'We offer comprehensive health insurance, dental coverage, life insurance, retirement planning, flexible work arrangements, professional development opportunities, and wellness programs. Details are available in the Employee Handbook.',
      category: 'general',
      tags: ['benefits', 'insurance', 'wellness'],
      lastUpdated: '2024-09-09'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📋', count: faqData.length },
    { value: 'hr', label: 'HR', icon: '👥', count: faqData.filter(item => item.category === 'hr').length },
    { value: 'payroll', label: 'Payroll', icon: '💰', count: faqData.filter(item => item.category === 'payroll').length },
    { value: 'it', label: 'IT', icon: '💻', count: faqData.filter(item => item.category === 'it').length },
    { value: 'general', label: 'General', icon: '🏢', count: faqData.filter(item => item.category === 'general').length }
  ];

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getCategoryColor = (category: FAQItem['category']) => {
    switch (category) {
      case 'hr': return 'bg-green-100 text-green-700 border-green-200';
      case 'payroll': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'it': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'general': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common HR, Payroll, IT, and general questions</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.value
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {searchTerm ? `Search Results (${filteredFAQs.length})` : 
             selectedCategory === 'all' ? 'All FAQs' : 
             `${categories.find(c => c.value === selectedCategory)?.label} FAQs`}
          </h2>
          
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map(faq => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{faq.question}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(faq.category)}`}>
                            {faq.category.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {faq.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Last updated: {new Date(faq.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedItems.includes(faq.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="px-6 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-semibold text-blue-900">Can't find what you're looking for?</h3>
          </div>
          <p className="text-blue-700 mb-4">
            If you can't find the answer to your question, you can submit a question through our Q&A/Helpdesk system.
          </p>
          <button
            onClick={() => window.location.href = '/helpdesk'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ask a Question
          </button>
        </div>
      </div>
    </Layout>
  );
}