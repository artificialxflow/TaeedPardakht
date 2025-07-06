import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Project, SubAccount, Account, CostCenter, Counterparty } from '../../types';

interface ProjectFormProps {
  project?: Project | null;
  isEdit?: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isEdit, onClose }) => {
  const { addProject, updateProject } = useData();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    subAccounts: [] as SubAccount[],
    costCenters: [] as CostCenter[],
    counterparties: [] as Counterparty[],
  });

  useEffect(() => {
    if (project && isEdit) {
      setFormData({
        name: project.name,
        subAccounts: project.subAccounts,
        costCenters: project.costCenters,
        counterparties: project.counterparties,
      });
    }
  }, [project, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && project) {
      updateProject(project.id, formData);
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        createdBy: user?.id || '',
      };
      addProject(newProject);
    }
    
    onClose();
  };

  // SubAccount handlers
  const addSubAccount = () => {
    const newSubAccount: SubAccount = {
      id: Date.now().toString(),
      title: '',
      accounts: [],
    };
    setFormData(prev => ({
      ...prev,
      subAccounts: [...prev.subAccounts, newSubAccount],
    }));
  };

  const updateSubAccount = (index: number, field: keyof SubAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      subAccounts: prev.subAccounts.map((subAccount, i) =>
        i === index ? { ...subAccount, [field]: value } : subAccount
      ),
    }));
  };

  const deleteSubAccount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subAccounts: prev.subAccounts.filter((_, i) => i !== index),
    }));
  };

  // Account handlers
  const addAccount = (subAccountIndex: number) => {
    const newAccount: Account = {
      id: Date.now().toString(),
      name: '',
      code: '',
    };
    setFormData(prev => ({
      ...prev,
      subAccounts: prev.subAccounts.map((subAccount, i) =>
        i === subAccountIndex
          ? { ...subAccount, accounts: [...subAccount.accounts, newAccount] }
          : subAccount
      ),
    }));
  };

  const updateAccount = (subAccountIndex: number, accountIndex: number, field: keyof Account, value: string) => {
    setFormData(prev => ({
      ...prev,
      subAccounts: prev.subAccounts.map((subAccount, i) =>
        i === subAccountIndex
          ? {
              ...subAccount,
              accounts: subAccount.accounts.map((account, j) =>
                j === accountIndex ? { ...account, [field]: value } : account
              ),
            }
          : subAccount
      ),
    }));
  };

  const deleteAccount = (subAccountIndex: number, accountIndex: number) => {
    setFormData(prev => ({
      ...prev,
      subAccounts: prev.subAccounts.map((subAccount, i) =>
        i === subAccountIndex
          ? { ...subAccount, accounts: subAccount.accounts.filter((_, j) => j !== accountIndex) }
          : subAccount
      ),
    }));
  };

  // Cost Center handlers
  const addCostCenter = () => {
    const newCostCenter: CostCenter = {
      id: Date.now().toString(),
      name: '',
      code: '',
    };
    setFormData(prev => ({
      ...prev,
      costCenters: [...prev.costCenters, newCostCenter],
    }));
  };

  const updateCostCenter = (index: number, field: keyof CostCenter, value: string) => {
    setFormData(prev => ({
      ...prev,
      costCenters: prev.costCenters.map((costCenter, i) =>
        i === index ? { ...costCenter, [field]: value } : costCenter
      ),
    }));
  };

  const deleteCostCenter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      costCenters: prev.costCenters.filter((_, i) => i !== index),
    }));
  };

  // Counterparty handlers
  const addCounterparty = () => {
    const newCounterparty: Counterparty = {
      id: Date.now().toString(),
      name: '',
      type: 'supplier',
      contactInfo: '',
    };
    setFormData(prev => ({
      ...prev,
      counterparties: [...prev.counterparties, newCounterparty],
    }));
  };

  const updateCounterparty = (index: number, field: keyof Counterparty, value: string) => {
    setFormData(prev => ({
      ...prev,
      counterparties: prev.counterparties.map((counterparty, i) =>
        i === index ? { ...counterparty, [field]: value } : counterparty
      ),
    }));
  };

  const deleteCounterparty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      counterparties: prev.counterparties.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? 'ویرایش پروژه' : 'پروژه جدید'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام پروژه
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نام پروژه را وارد کنید"
              required
            />
          </div>

          {/* Sub Accounts */}
          <div className="border rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-red-700">سرفصل‌ها و معین‌ها</h3>
              <button
                type="button"
                onClick={addSubAccount}
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                افزودن سرفصل
              </button>
            </div>
            
            {formData.subAccounts.map((subAccount, subIndex) => (
              <div key={subAccount.id} className="mb-6 p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={subAccount.title}
                    onChange={(e) => updateSubAccount(subIndex, 'title', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="عنوان سرفصل"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => deleteSubAccount(subIndex)}
                    className="text-red-600 hover:text-red-800 p-1 mr-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">معین‌ها:</span>
                    <button
                      type="button"
                      onClick={() => addAccount(subIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      افزودن معین
                    </button>
                  </div>
                  
                  {subAccount.accounts.map((account, accIndex) => (
                    <div key={account.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={account.name}
                        onChange={(e) => updateAccount(subIndex, accIndex, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        placeholder="نام معین"
                        required
                      />
                      <input
                        type="text"
                        value={account.code}
                        onChange={(e) => updateAccount(subIndex, accIndex, 'code', e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="کد"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => deleteAccount(subIndex, accIndex)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Centers */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-blue-700">مراکز هزینه</h3>
              <button
                type="button"
                onClick={addCostCenter}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                افزودن مرکز هزینه
              </button>
            </div>
            
            {formData.costCenters.map((costCenter, index) => (
              <div key={costCenter.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={costCenter.name}
                  onChange={(e) => updateCostCenter(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="نام مرکز هزینه"
                  required
                />
                <input
                  type="text"
                  value={costCenter.code}
                  onChange={(e) => updateCostCenter(index, 'code', e.target.value)}
                  className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="کد"
                  required
                />
                <button
                  type="button"
                  onClick={() => deleteCostCenter(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Counterparties */}
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-green-700">طرفین حساب</h3>
              <button
                type="button"
                onClick={addCounterparty}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                افزودن طرف حساب
              </button>
            </div>
            
            {formData.counterparties.map((counterparty, index) => (
              <div key={counterparty.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={counterparty.name}
                  onChange={(e) => updateCounterparty(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="نام طرف حساب"
                  required
                />
                <select
                  value={counterparty.type}
                  onChange={(e) => updateCounterparty(index, 'type', e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="supplier">تأمین کننده</option>
                  <option value="contractor">پیمانکار</option>
                  <option value="other">سایر</option>
                </select>
                <input
                  type="text"
                  value={counterparty.contactInfo}
                  onChange={(e) => updateCounterparty(index, 'contactInfo', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="تماس"
                />
                <button
                  type="button"
                  onClick={() => deleteCounterparty(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              لغو
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEdit ? 'بروزرسانی' : 'ذخیره'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;