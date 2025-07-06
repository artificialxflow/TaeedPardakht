import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PaymentRequest } from '../../types';
import PaymentRequestModal from './PaymentRequestModal';

const PaymentApprovalList: React.FC = () => {
  const { paymentRequests, projects, updatePaymentRequest } = useData();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const pendingRequests = paymentRequests.filter(req => req.status === 'pending');

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'پروژه نامشخص';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const handleApprove = (requestId: string) => {
    if (window.confirm('آیا از تایید این درخواست اطمینان دارید؟')) {
      updatePaymentRequest(requestId, {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: user?.id,
      });
    }
  };

  const handleReject = (requestId: string) => {
    const reason = window.prompt('لطفاً دلیل رد درخواست را وارد کنید:');
    if (reason) {
      updatePaymentRequest(requestId, {
        status: 'rejected',
        rejectionReason: reason,
        approvedAt: new Date(),
        approvedBy: user?.id,
      });
    }
  };

  const canApprove = (amount: number) => {
    return user?.permissions.maxApprovalAmount ? amount <= user.permissions.maxApprovalAmount : true;
  };

  const handleViewDetails = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">تایید پرداخت</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{pendingRequests.length} درخواست در انتظار تایید</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">در انتظار تایید</p>
              <p className="text-2xl font-bold text-yellow-800">{pendingRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">کل مبلغ</p>
              <p className="text-lg font-bold text-blue-800">
                {formatCurrency(pendingRequests.reduce((sum, req) => sum + req.amount, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">حد اختیار شما</p>
              <p className="text-lg font-bold text-green-800">
                {user?.permissions.maxApprovalAmount 
                  ? formatCurrency(user.permissions.maxApprovalAmount)
                  : 'نامحدود'}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">درخواست‌های در انتظار تایید</h3>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>هیچ درخواست در انتظار تایید وجود ندارد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره درخواست
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پروژه
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شرح
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ ثبت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-800">{request.requestNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{getProjectName(request.projectId)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 max-w-xs truncate" title={request.description}>
                        {request.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${canApprove(request.amount) ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(request.amount)}
                      </div>
                      {!canApprove(request.amount) && (
                        <div className="text-xs text-red-500">خارج از حد اختیار</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {request.createdAt.toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="مشاهده جزئیات"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canApprove(request.amount) && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="تایید"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="رد"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <PaymentRequestModal
          request={selectedRequest}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          canApprove={canApprove(selectedRequest.amount)}
        />
      )}
    </div>
  );
};

export default PaymentApprovalList;