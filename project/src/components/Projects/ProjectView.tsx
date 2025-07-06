import React from 'react';
import { X } from 'lucide-react';
import { Project } from '../../types';

interface ProjectViewProps {
  project: Project;
  onClose: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">جزئیات پروژه</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">اطلاعات پروژه</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">نام پروژه:</span>
                <p className="font-medium text-gray-800">{project.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">تاریخ ایجاد:</span>
                <p className="font-medium text-gray-800">{project.createdAt.toLocaleDateString('fa-IR')}</p>
              </div>
            </div>
          </div>

          {/* Sub Accounts */}
          <div className="border rounded-lg p-4 bg-red-50">
            <h3 className="text-lg font-medium text-red-700 mb-4">سرفصل‌ها و معین‌ها</h3>
            {project.subAccounts.length === 0 ? (
              <p className="text-gray-600">هیچ سرفصلی تعریف نشده است</p>
            ) : (
              <div className="space-y-4">
                {project.subAccounts.map((subAccount) => (
                  <div key={subAccount.id} className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">{subAccount.title}</h4>
                    {subAccount.accounts.length === 0 ? (
                      <p className="text-sm text-gray-600">هیچ معینی تعریف نشده است</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {subAccount.accounts.map((account) => (
                          <div key={account.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-800">{account.name}</span>
                            <span className="text-xs text-gray-600">{account.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cost Centers */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-medium text-blue-700 mb-4">مراکز هزینه</h3>
            {project.costCenters.length === 0 ? (
              <p className="text-gray-600">هیچ مرکز هزینه‌ای تعریف نشده است</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {project.costCenters.map((costCenter) => (
                  <div key={costCenter.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-800">{costCenter.name}</span>
                    <span className="text-sm text-gray-600">{costCenter.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Counterparties */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-medium text-green-700 mb-4">طرفین حساب</h3>
            {project.counterparties.length === 0 ? (
              <p className="text-gray-600">هیچ طرف حسابی تعریف نشده است</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {project.counterparties.map((counterparty) => (
                  <div key={counterparty.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <span className="text-gray-800 font-medium">{counterparty.name}</span>
                      <span className="text-sm text-gray-600 mr-2">
                        ({counterparty.type === 'supplier' ? 'تأمین کننده' :
                          counterparty.type === 'contractor' ? 'پیمانکار' : 'سایر'})
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{counterparty.contactInfo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;