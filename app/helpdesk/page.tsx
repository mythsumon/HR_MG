'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';

interface Question {
  id: number;
  title: string;
  description: string;
  category: 'hr' | 'payroll' | 'it' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  author: string;
  authorRole: 'employee' | 'manager';
  dateCreated: string;
  dateResolved?: string;
  replies: Reply[];
  tags: string[];
}

interface Reply {
  id: number;
  content: string;
  author: string;
  authorRole: 'employee' | 'manager' | 'hr' | 'admin';
  date: string;
  isResolution?: boolean;
}

export default function HelpdeskPage() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      title: 'How to apply leave for half day?',
      description: 'I need to take half day leave tomorrow for a medical appointment. How can I apply for this in the system?',
      category: 'hr',
      priority: 'medium',
      status: 'resolved',
      author: 'John Smith',
      authorRole: 'employee',
      dateCreated: '2024-09-16',
      dateResolved: '2024-09-17',
      tags: ['leave', 'half-day', 'medical'],
      replies: [
        {
          id: 1,
          content: 'Hi John, you can apply for half-day leave by going to Leave Requests, selecting "Half Day" as the leave type, and specifying the time (morning or afternoon). Make sure to mention the reason for your appointment.',
          author: 'Sarah Johnson',
          authorRole: 'hr',
          date: '2024-09-16',
          isResolution: true
        },
        {
          id: 2,
          content: 'Thank you Sarah! I found the option and submitted my request.',
          author: 'John Smith',
          authorRole: 'employee',
          date: '2024-09-17'
        }
      ]
    },
    {
      id: 2,
      title: 'Payroll deduction query',
      description: 'I notice an additional deduction in my payslip this month that I don\'t recognize. Can someone help me understand what this is for?',
      category: 'payroll',
      priority: 'high',
      status: 'in-progress',
      author: 'Mike Johnson',
      authorRole: 'employee',
      dateCreated: '2024-09-17',
      tags: ['payroll', 'deduction', 'payslip'],
      replies: [
        {
          id: 3,
          content: 'Hi Mike, I\'m looking into your payroll query. Could you please send me your employee ID and the specific amount of the deduction you\'re referring to? I\'ll check with the payroll team.',
          author: 'Finance Team',
          authorRole: 'hr',
          date: '2024-09-17'
        }
      ]
    },
    {
      id: 3,
      title: 'VPN connection issues',
      description: 'I\'m unable to connect to the company VPN from my home office. Getting error code 807. This is affecting my ability to access internal systems.',
      category: 'it',
      priority: 'high',
      status: 'open',
      author: 'Lisa Wilson',
      authorRole: 'employee',
      dateCreated: '2024-09-18',
      tags: ['vpn', 'remote', 'connection', 'error'],
      replies: []
    }
  ]);

  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: 'general' as Question['category'],
    priority: 'medium' as Question['priority'],
    tags: ''
  });
  const [newReply, setNewReply] = useState('');

  const getStatusColor = (status: Question['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700 border-red-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Question['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: Question['category']) => {
    switch (category) {
      case 'hr': return '👥';
      case 'payroll': return '💰';
      case 'it': return '💻';
      case 'general': return '🏢';
      default: return '❓';
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesStatus = filterStatus === 'all' || question.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || question.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const handleSubmitQuestion = () => {
    const question: Question = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      title: newQuestion.title,
      description: newQuestion.description,
      category: newQuestion.category,
      priority: newQuestion.priority,
      status: 'open',
      author: 'Current User',
      authorRole: 'employee',
      dateCreated: new Date().toISOString().split('T')[0],
      tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      replies: []
    };

    setQuestions(prev => [question, ...prev]);
    setNewQuestion({ title: '', description: '', category: 'general', priority: 'medium', tags: '' });
    setShowNewQuestionModal(false);
  };

  const handleAddReply = () => {
    if (!selectedQuestion || !newReply.trim()) return;

    const reply: Reply = {
      id: Math.max(...(selectedQuestion.replies?.map(r => r.id) || [0])) + 1,
      content: newReply,
      author: 'Current User',
      authorRole: 'employee',
      date: new Date().toISOString().split('T')[0]
    };

    setQuestions(prev => prev.map(q => 
      q.id === selectedQuestion.id 
        ? { ...q, replies: [...(q.replies || []), reply] }
        : q
    ));

    setNewReply('');
    // Update selected question
    setSelectedQuestion(prev => prev ? { ...prev, replies: [...(prev.replies || []), reply] } : null);
  };

  const markAsResolved = (questionId: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, status: 'resolved', dateResolved: new Date().toISOString().split('T')[0] }
        : q
    ));
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(prev => prev ? { ...prev, status: 'resolved' } : null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Q&A / Helpdesk</h1>
            <p className="text-gray-600">Ask questions and get help from HR and IT teams</p>
          </div>
          <button
            onClick={() => setShowNewQuestionModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Ask Question</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="hr">HR</option>
                <option value="payroll">Payroll</option>
                <option value="it">IT</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map(question => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedQuestion(question)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(question.category)}</span>
                    <h3 className="font-semibold text-gray-900">{question.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(question.status)}`}>
                      {question.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(question.priority)}`}>
                      {question.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {question.author}</span>
                    <span>•</span>
                    <span>{new Date(question.dateCreated).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{question.replies?.length || 0} replies</span>
                    {question.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex space-x-1">
                          {question.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                          {question.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{question.tags.length - 2} more</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Question Detail Modal */}
        {selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedQuestion(null)}>
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">{getCategoryIcon(selectedQuestion.category)}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedQuestion.title}</h3>
                    <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(selectedQuestion.status)}`}>
                      {selectedQuestion.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full border ${getPriorityColor(selectedQuestion.priority)}`}>
                      {selectedQuestion.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700">{selectedQuestion.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>Asked by {selectedQuestion.author}</span>
                    <span>•</span>
                    <span>{new Date(selectedQuestion.dateCreated).toLocaleDateString()}</span>
                    {selectedQuestion.dateResolved && (
                      <>
                        <span>•</span>
                        <span>Resolved on {new Date(selectedQuestion.dateResolved).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  
                  {selectedQuestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedQuestion.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl ml-4"
                >
                  ✕
                </button>
              </div>

              {/* Replies */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">Replies ({selectedQuestion.replies?.length || 0})</h4>
                
                {selectedQuestion.replies?.map(reply => (
                  <div key={reply.id} className={`rounded-lg p-4 ${reply.isResolution ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                    {reply.isResolution && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-green-700 font-medium text-sm">Resolution</span>
                      </div>
                    )}
                    <p className="text-gray-700 mb-2">{reply.content}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{reply.author}</span>
                      <span>•</span>
                      <span>{new Date(reply.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                
                {(!selectedQuestion.replies || selectedQuestion.replies.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No replies yet</p>
                )}
              </div>

              {/* Add Reply */}
              {selectedQuestion.status !== 'closed' && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Add Reply</h4>
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="space-x-2">
                      {selectedQuestion.status === 'open' || selectedQuestion.status === 'in-progress' ? (
                        <button
                          onClick={() => markAsResolved(selectedQuestion.id)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          ✅ Mark as Resolved
                        </button>
                      ) : null}
                    </div>
                    <button
                      onClick={handleAddReply}
                      disabled={!newReply.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Question Modal */}
        {showNewQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNewQuestionModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Ask a Question</h3>
                <button 
                  onClick={() => setShowNewQuestionModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={e => { e.preventDefault(); handleSubmitQuestion(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your question"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide detailed information about your question or issue"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value as Question['category'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">🏢 General</option>
                      <option value="hr">👥 HR</option>
                      <option value="payroll">💰 Payroll</option>
                      <option value="it">💻 IT</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newQuestion.priority}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, priority: e.target.value as Question['priority'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
                  <input
                    type="text"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Separate tags with commas (e.g., leave, vacation, medical)"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowNewQuestionModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}