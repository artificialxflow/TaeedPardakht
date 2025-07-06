import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Project, SubAccount, Account, CostCenter, Counterparty } from '../../types';
import ProjectForm from './ProjectForm';
import ProjectView from './ProjectView';

const ProjectManagement: React.FC = () => {
  const { projects, deleteProject } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditMode(true);
    setShowForm(true);
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setShowView(true);
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('آیا از حذف این پروژه اطمینان دارید؟')) {
      deleteProject(projectId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProject(null);
    setEditMode(false);
  };

  const handleCloseView = () => {
    setShowView(false);
    setSelectedProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت پروژه‌ها</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          پروژه جدید
        </button>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">لیست پروژه‌ها</h3>
        </div>
        
        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>هیچ پروژه‌ای تعریف نشده است</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نام پروژه
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تعداد سرفصل‌ها
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تعداد مراکز هزینه
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تعداد طرفین حساب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ ایجاد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-800">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {project.subAccounts.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {project.costCenters.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {project.counterparties.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {project.createdAt.toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(project)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="مشاهده جزئیات"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="ویرایش"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={selectedProject}
          isEdit={editMode}
          onClose={handleCloseForm}
        />
      )}

      {/* Project View Modal */}
      {showView && selectedProject && (
        <ProjectView
          project={selectedProject}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
};

export default ProjectManagement;