import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp 
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { paymentRequests } = useData();
  const { user } = useAuth();

  const stats = {
    totalRequests: paymentRequests.length,
    pendingRequests: paymentRequests.filter(r => r.status === 'pending').length,
    approvedRequests: paymentRequests.filter(r => r.status === 'approved').length,
    paidRequests: paymentRequests.filter(r => r.status === 'paid').length,
    totalAmount: paymentRequests.reduce((sum, r) => sum + r.amount, 0),
    paidAmount: paymentRequests.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const statCards = [
    {
      title: 'کل درخواست‌ها',
      value: stats.totalRequests,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'در انتظار تایید',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'تایید شده',
      value: stats.approvedRequests,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'پرداخت شده',
      value: stats.paidRequests,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">داشبورد</h1>
        <div className="text-sm text-gray-600">
          آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`${card.bgColor} p-6 rounded-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">بررسی مالی</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">کل مبلغ درخواست‌ها:</span>
              <span className="font-bold text-gray-800">{formatCurrency(stats.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مبلغ پرداخت شده:</span>
              <span className="font-bold text-green-600">{formatCurrency(stats.paidAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">باقی‌مانده:</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(stats.totalAmount - stats.paidAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">درخواست‌های اخیر</h3>
          <div className="space-y-3">
            {paymentRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-500' :
                    request.status === 'approved' ? 'bg-green-500' :
                    request.status === 'paid' ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{request.requestNumber}</p>
                    <p className="text-sm text-gray-600">{request.description.substring(0, 50)}...</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">{formatCurrency(request.amount)}</p>
                  <p className="text-sm text-gray-600">
                    {request.createdAt.toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">دسترسی سریع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.permissions.canCreateRequest && (
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">درخواست جدید</p>
            </button>
          )}
          {user?.permissions.canApprovePayment && (
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">تایید پرداخت</p>
            </button>
          )}
          {user?.permissions.canViewReports && (
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">گزارشات</p>
            </button>
          )}
          {user?.permissions.canManageUsers && (
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
              <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">مدیریت کاربران</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;