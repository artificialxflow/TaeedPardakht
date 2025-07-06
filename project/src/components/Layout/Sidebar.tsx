import React from 'react';
import { 
  Home, 
  FolderPlus, 
  FileText, 
  CheckCircle, 
  CreditCard, 
  BarChart3, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: Home, permission: true },
    { id: 'projects', label: 'تعریف پروژه', icon: FolderPlus, permission: user?.permissions.canManageUsers },
    { id: 'requests', label: 'درخواست پرداخت', icon: FileText, permission: user?.permissions.canCreateRequest },
    { id: 'approvals', label: 'تایید پرداخت', icon: CheckCircle, permission: user?.permissions.canApprovePayment },
    { id: 'payments', label: 'پرداخت‌ها', icon: CreditCard, permission: user?.permissions.canMakePayment },
    { id: 'reports', label: 'گزارشات', icon: BarChart3, permission: user?.permissions.canViewReports },
    { id: 'users', label: 'مدیریت کاربران', icon: Users, permission: user?.permissions.canManageUsers },
  ];

  const visibleItems = menuItems.filter(item => item.permission);

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">سامانه مدیریت پرداخت</h1>
        <p className="text-sm text-gray-600 mt-1">خوش آمدید {user?.username}</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 ml-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-right rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 ml-3" />
          خروج
        </button>
      </div>
    </div>
  );
};

export default Sidebar;