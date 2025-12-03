'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  budget: string;
}

interface Team {
  id: string;
  name: string;
  department: string;
  lead: string;
  memberCount: number;
  projects: number;
}

interface OrganizationStructure {
  departments: Department[];
  teams: Team[];
}

export default function OrganizationPage() {
  const [userRole, setUserRole] = useState<'employee' | 'manager'>('employee');
  const [activeTab, setActiveTab] = useState<'departments' | 'teams' | 'structure'>('structure');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Department | Team | null>(null);

  // Load user role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'employee' | 'manager';
    if (storedRole) {
      setUserRole(storedRole);
      // Set default tab to structure for employees
      if (storedRole === 'employee') {
        setActiveTab('structure');
      }
    }
  }, []);

  // Mock data for organization structure
  const [orgData, setOrgData] = useState<OrganizationStructure>({
    departments: [
      {
        id: '1',
        name: 'Human Resources',
        head: 'Sarah Johnson',
        employeeCount: 12,
        budget: '$150,000'
      },
      {
        id: '2',
        name: 'Engineering',
        head: 'Michael Chen',
        employeeCount: 35,
        budget: '$850,000'
      },
      {
        id: '3',
        name: 'Marketing',
        head: 'Emma Rodriguez',
        employeeCount: 18,
        budget: '$320,000'
      },
      {
        id: '4',
        name: 'Finance',
        head: 'David Wilson',
        employeeCount: 8,
        budget: '$200,000'
      },
      {
        id: '5',
        name: 'Operations',
        head: 'James Brown',
        employeeCount: 22,
        budget: '$420,000'
      }
    ],
    teams: [
      {
        id: '1',
        name: 'Frontend Development',
        department: 'Engineering',
        lead: 'Alex Kim',
        memberCount: 8,
        projects: 5
      },
      {
        id: '2',
        name: 'Backend Development',
        department: 'Engineering',
        lead: 'Priya Sharma',
        memberCount: 12,
        projects: 7
      },
      {
        id: '3',
        name: 'UI/UX Design',
        department: 'Engineering',
        lead: 'Jennifer Lee',
        memberCount: 5,
        projects: 4
      },
      {
        id: '4',
        name: 'Recruitment',
        department: 'Human Resources',
        lead: 'Robert Taylor',
        memberCount: 4,
        projects: 2
      },
      {
        id: '5',
        name: 'Digital Marketing',
        department: 'Marketing',
        lead: 'Thomas Anderson',
        memberCount: 7,
        projects: 3
      },
      {
        id: '6',
        name: 'Content Marketing',
        department: 'Marketing',
        lead: 'Lisa Garcia',
        memberCount: 6,
        projects: 4
      }
    ]
  });

  const handleCreateDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...department,
      id: Date.now().toString()
    };
    setOrgData({
      ...orgData,
      departments: [...orgData.departments, newDepartment]
    });
    setShowCreateModal(false);
  };

  const handleCreateTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString()
    };
    setOrgData({
      ...orgData,
      teams: [...orgData.teams, newTeam]
    });
    setShowCreateModal(false);
  };

  const handleUpdateDepartment = (updatedDepartment: Department) => {
    setOrgData({
      ...orgData,
      departments: orgData.departments.map(dept => 
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    });
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    setOrgData({
      ...orgData,
      teams: orgData.teams.map(team => 
        team.id === updatedTeam.id ? updatedTeam : team
      )
    });
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDeleteDepartment = (id: string) => {
    setOrgData({
      ...orgData,
      departments: orgData.departments.filter(dept => dept.id !== id)
    });
  };

  const handleDeleteTeam = (id: string) => {
    setOrgData({
      ...orgData,
      teams: orgData.teams.filter(team => team.id !== id)
    });
  };

  const openEditModal = (item: Department | Team) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setShowCreateModal(true);
  };

  const filteredDepartments = orgData.departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeams = orgData.teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.lead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organization Structure</h1>
            <p className="text-gray-600">View organizational hierarchy</p>
          </div>
          {userRole === 'manager' && (
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <span>+</span>
              <span>Add New</span>
            </button>
          )}
        </div>

        {/* Search and Filters - Only visible to managers */}
        {userRole === 'manager' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search departments or teams..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('departments')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'departments'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Departments
                </button>
                <button
                  onClick={() => setActiveTab('teams')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'teams'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Teams
                </button>
                <button
                  onClick={() => setActiveTab('structure')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'structure'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Org Chart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Departments Tab - Only visible to managers */}
        {userRole === 'manager' && activeTab === 'departments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Departments ({filteredDepartments.length})</h3>
            </div>
            
            {filteredDepartments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">🏢</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No departments found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDepartments.map((dept) => (
                  <div key={dept.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <span className="text-2xl">🏢</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{dept.name}</h4>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Head: {dept.head}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {dept.employeeCount} employees
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Budget: {dept.budget}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(dept)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Department"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Department"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Teams Tab - Only visible to managers */}
        {userRole === 'manager' && activeTab === 'teams' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Teams ({filteredTeams.length})</h3>
            </div>
            
            {filteredTeams.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No teams found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTeams.map((team) => (
                  <div key={team.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <span className="text-2xl">👥</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{team.name}</h4>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {team.department}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Lead: {team.lead}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {team.memberCount} members
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              {team.projects} projects
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(team)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Team"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Team"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Organization Structure Tab */}
        {(userRole === 'manager' ? activeTab === 'structure' : true) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="px-6 py-4 border-b border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Organization Chart</h3>
            </div>
            
            <div className="flex flex-col items-center">
              {/* CEO */}
              <div className="relative group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-xl shadow-lg w-56 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="font-bold text-lg">Chief Executive Officer</div>
                  <div className="text-base mt-1">John Smith</div>
                  <div className="text-xs opacity-80 mt-2">Reports to Board</div>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rotate-45"></div>
              </div>
              
              {/* Connectors */}
              <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-gray-300 mb-6"></div>
              
              {/* Departments */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                {orgData.departments.map((dept) => (
                  <div key={dept.id} className="flex flex-col items-center group">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl shadow-lg w-48 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="font-bold text-base">{dept.name}</div>
                      <div className="text-sm mt-1">{dept.head}</div>
                      <div className="text-xs opacity-90 mt-2">{dept.employeeCount} team members</div>
                    </div>
                    
                    {/* Teams under department */}
                    <div className="flex flex-col items-center space-y-4 mt-5">
                      {orgData.teams
                        .filter(team => team.department === dept.name)
                        .map((team, index) => (
                          <>
                            <div className="h-4 w-1 bg-gradient-to-b from-emerald-400 to-gray-300 dark:to-gray-600"></div>
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-lg shadow-md w-40 text-center transform transition-all duration-300 hover:scale-105">
                              <div className="font-medium text-sm">{team.name}</div>
                              <div className="text-xs mt-1">{team.lead}</div>
                              <div className="text-xs opacity-90 mt-1">{team.memberCount} members</div>
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <CreateEditModal
            mode="create"
            type={activeTab === 'departments' ? 'department' : 'team'}
            onCreateDepartment={handleCreateDepartment}
            onCreateTeam={handleCreateTeam}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {showEditModal && selectedItem && (
          <CreateEditModal
            mode="edit"
            type={'name' in selectedItem ? 'department' : 'team'}
            item={selectedItem}
            onUpdateDepartment={handleUpdateDepartment}
            onUpdateTeam={handleUpdateTeam}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}

// Modal Component for Creating/Editing Departments and Teams
function CreateEditModal({ 
  mode, 
  type,
  item,
  onCreateDepartment,
  onCreateTeam,
  onUpdateDepartment,
  onUpdateTeam,
  onClose
}: { 
  mode: 'create' | 'edit';
  type: 'department' | 'team';
  item?: Department | Team;
  onCreateDepartment?: (department: Omit<Department, 'id'>) => void;
  onCreateTeam?: (team: Omit<Team, 'id'>) => void;
  onUpdateDepartment?: (department: Department) => void;
  onUpdateTeam?: (team: Team) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    head: type === 'department' ? (item as Department)?.head || '' : (item as Team)?.lead || '',
    employeeCount: type === 'department' ? (item as Department)?.employeeCount?.toString() || '' : (item as Team)?.memberCount?.toString() || '',
    budget: type === 'department' ? (item as Department)?.budget || '' : '',
    department: type === 'team' ? (item as Team)?.department || '' : '',
    projects: type === 'team' ? (item as Team)?.projects?.toString() || '' : ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      if (type === 'department' && onCreateDepartment) {
        onCreateDepartment({
          name: formData.name,
          head: formData.head,
          employeeCount: parseInt(formData.employeeCount) || 0,
          budget: formData.budget
        });
      } else if (type === 'team' && onCreateTeam) {
        onCreateTeam({
          name: formData.name,
          department: formData.department,
          lead: formData.head,
          memberCount: parseInt(formData.employeeCount) || 0,
          projects: parseInt(formData.projects) || 0
        });
      }
    } else {
      if (type === 'department' && onUpdateDepartment && item) {
        onUpdateDepartment({
          id: (item as Department).id,
          name: formData.name,
          head: formData.head,
          employeeCount: parseInt(formData.employeeCount) || 0,
          budget: formData.budget
        });
      } else if (type === 'team' && onUpdateTeam && item) {
        onUpdateTeam({
          id: (item as Team).id,
          name: formData.name,
          department: formData.department,
          lead: formData.head,
          memberCount: parseInt(formData.employeeCount) || 0,
          projects: parseInt(formData.projects) || 0
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? `Create New ${type === 'department' ? 'Department' : 'Team'}` : `Edit ${type === 'department' ? 'Department' : 'Team'}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {type === 'department' ? 'Department Name' : 'Team Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {type === 'department' ? 'Department Head' : 'Team Lead'}
                </label>
                <input
                  type="text"
                  name="head"
                  value={formData.head}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {type === 'department' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                    <input
                      type="number"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="$0"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Count</label>
                    <input
                      type="number"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
                    <input
                      type="number"
                      name="projects"
                      value={formData.projects}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {mode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}