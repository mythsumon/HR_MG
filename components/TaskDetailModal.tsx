'use client';

import React, { useState } from 'react';
import { Task } from '@/components/TaskComponents';
import { StatusChip, PriorityChip, ProgressBar, Avatar } from '@/components/TaskComponents';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  userRole: 'employee' | 'hr';
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  userRole
}) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !task) return null;

  const handleStatusChange = (newStatus: Task['status']) => {
    const updatedTask = {
      ...task,
      status: newStatus,
      progress: newStatus === 'completed' ? 100 : newStatus === 'pending' ? 0 : task.progress,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateTask(updatedTask);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedTask = {
        ...task,
        comments: [
          ...task.comments,
          {
            id: `comment-${Date.now()}`,
            author: userRole === 'hr' ? 'HR Manager' : 'John Doe',
            text: newComment.trim(),
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
      onUpdateTask(updatedTask);
      setNewComment('');
    }
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    );
    const completedCount = updatedSubtasks.filter(s => s.completed).length;
    const newProgress = task.subtasks.length > 0 ? Math.round((completedCount / task.subtasks.length) * 100) : 0;
    
    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
      progress: newProgress
    };
    onUpdateTask(updatedTask);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">#{task.id}</span>
                <span className="text-sm text-gray-500">📁 {task.project}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl p-2">✕</button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{task.description}</p>
            </div>

            {/* Subtasks */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</h3>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <label key={subtask.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleSubtaskToggle(subtask.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className={`ml-3 text-sm ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Comments</h3>
              <div className="space-y-3 mb-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..." 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button 
                  onClick={handleAddComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Priority:</span>
                <div className="mt-1"><PriorityChip priority={task.priority} /></div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Assignee:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar name={task.assignee.name} size="xs" />
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Due Date:</span>
                <div className="text-sm text-gray-900 mt-1">📅 {new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Progress:</span>
                <div className="mt-1"><ProgressBar progress={task.progress} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};