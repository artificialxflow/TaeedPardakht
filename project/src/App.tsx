import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectManagement from './components/Projects/ProjectManagement';
import PaymentRequestForm from './components/PaymentRequest/PaymentRequestForm';
import PaymentApprovalList from './components/PaymentApproval/PaymentApprovalList';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectManagement />;
      case 'requests':
        return <PaymentRequestForm />;
      case 'approvals':
        return <PaymentApprovalList />;
      case 'payments':
        return <div className="p-6 text-center text-gray-500">صفحه پرداخت‌ها در حال توسعه...</div>;
      case 'reports':
        return <div className="p-6 text-center text-gray-500">صفحه گزارشات در حال توسعه...</div>;
      case 'users':
        return <div className="p-6 text-center text-gray-500">صفحه مدیریت کاربران در حال توسعه...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;