import React, { useState, useEffect } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PaymentRequest } from '../../types';

const PaymentRequestForm: React.FC = () => {
  const { projects, addPaymentRequest } = useData();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    projectId: '',
    subAccountId: '',
    accountId: '',
    costCenterId: '',
    counterpartyId: '',
    description: '',
    amount: '',
    accountType: '',
    accountInfo: '',
  });
  
  const [documents, setDocuments] = useState<File[]>([]);
  const [selectedProject, setSelectedProject] = useState(projects[0] || null);

  const generateRequestNumber = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const count = 1; // In a real app, this would be calculated from existing requests
    return `${year}-${month.toString().padStart(2, '0')}-${count.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: PaymentRequest = {
      id: Date.now().toString(),
      requestNumber: generateRequestNumber(),
      projectId: formData.projectId,
      subAccountId: formData.subAccountId,
      accountId: formData.accountId,
      costCenterId: formData.costCenterId,
      counterpartyId: formData.counterpartyId,
      description: formData.description,
      amount: parseFloat(formData.amount),
      accountType: formData.accountType,
      accountInfo: formData.accountInfo,
      documents: documents.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      })),
      status: 'pending',
      createdAt: new Date(),
      createdBy: user?.id || '',
    };

    addPaymentRequest(newRequest);
    
    // Reset form
    setFormData({
      projectId: '',
      subAccountId: '',
      accountId: '',
      costCenterId: '',
      counterpartyId: '',
      description: '',
      amount: '',
      accountType: '',
      accountInfo: '',
    });
    setDocuments([]);
    
    alert('درخواست پرداخت با موفقیت ثبت شد');
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
    setFormData(prev => ({
      ...prev,
      projectId,
      subAccountId: '',
      accountId: '',
      costCenterId: '',
      counterpartyId: '',
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setDocuments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">درخواست پرداخت</h1>
        <div className="text-sm text-gray-600">
          تاریخ: {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        {/* Red Section - Dropdown Fields */}
        <div className="border-r-4 border-red-500 pr-4 bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-700 mb-4">اطلاعات پروژه (از منوی کشویی انتخاب کنید)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام پروژه</label>
              <select
                value={formData.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">انتخاب پروژه</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            {/* Sub Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">سرفصل</label>
              <select
                value={formData.subAccountId}
                onChange={(e) => setFormData(prev => ({ ...prev, subAccountId: e.target.value, accountId: '' }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={!selectedProject}
              >
                <option value="">انتخاب سرفصل</option>
                {selectedProject?.subAccounts.map(subAccount => (
                  <option key={subAccount.id} value={subAccount.id}>{subAccount.title}</option>
                ))}
              </select>
            </div>

            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">معین</label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={!formData.subAccountId}
              >
                <option value="">انتخاب معین</option>
                {selectedProject?.subAccounts
                  .find(sub => sub.id === formData.subAccountId)
                  ?.accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
              </select>
            </div>

            {/* Cost Center Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">مرکز هزینه</label>
              <select
                value={formData.costCenterId}
                onChange={(e) => setFormData(prev => ({ ...prev, costCenterId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={!selectedProject}
              >
                <option value="">انتخاب مرکز هزینه</option>
                {selectedProject?.costCenters.map(costCenter => (
                  <option key={costCenter.id} value={costCenter.id}>{costCenter.name}</option>
                ))}
              </select>
            </div>

            {/* Counterparty Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">طرف حساب</label>
              <select
                value={formData.counterpartyId}
                onChange={(e) => setFormData(prev => ({ ...prev, counterpartyId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={!selectedProject}
              >
                <option value="">انتخاب طرف حساب</option>
                {selectedProject?.counterparties.map(counterparty => (
                  <option key={counterparty.id} value={counterparty.id}>{counterparty.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Green Section - Auto-filled Fields */}
        <div className="border-r-4 border-green-500 pr-4 bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-700 mb-4">اطلاعات خودکار سیستم</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ و زمان</label>
              <input
                type="text"
                value={new Date().toLocaleDateString('fa-IR') + ' ' + new Date().toLocaleTimeString('fa-IR')}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شماره درخواست</label>
              <input
                type="text"
                value={generateRequestNumber()}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Blue Section - User Input Fields */}
        <div className="border-r-4 border-blue-500 pr-4 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-700 mb-4">اطلاعات درخواست (توسط کاربر تکمیل شود)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شرح پرداخت</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="شرح کاملی از پرداخت ارائه دهید..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ (تومان)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مبلغ را وارد کنید"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع حساب</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">انتخاب نوع حساب</option>
                  <option value="bank_card">کارت بانکی</option>
                  <option value="bank_account">حساب بانکی</option>
                  <option value="cash">نقدی</option>
                  <option value="check">چک</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اطلاعات حساب</label>
              <input
                type="text"
                value={formData.accountInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, accountInfo: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اطلاعات حساب (شماره کارت، شماره حساب، و غیره)"
                required
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="border-r-4 border-purple-500 pr-4 bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-700 mb-4">آپلود مستندات</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-purple-500" />
                  <p className="mb-2 text-sm text-purple-600">
                    <span className="font-semibold">برای آپلود کلیک کنید</span>
                  </p>
                  <p className="text-xs text-purple-500">PDF, JPG, PNG (حداکثر 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">فایل‌های آپلود شده:</h4>
                {documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              setFormData({
                projectId: '',
                subAccountId: '',
                accountId: '',
                costCenterId: '',
                counterpartyId: '',
                description: '',
                amount: '',
                accountType: '',
                accountInfo: '',
              });
              setDocuments([]);
            }}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            پاک کردن
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ثبت درخواست
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentRequestForm;