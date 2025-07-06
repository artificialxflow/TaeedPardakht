import React from 'react';
import { X, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { PaymentRequest } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PaymentRequestModalProps {
  request: PaymentRequest;
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  canApprove: boolean;
}

const PaymentRequestModal: React.FC<PaymentRequestModalProps> = ({
  request,
  onClose,
  onApprove,
  onReject,
  canApprove,
}) => {
  const { projects } = useData();
  
  const project = projects.find(p => p.id === request.projectId);
  const subAccount = project?.subAccounts.find(sub => sub.id === request.subAccountId);
  const account = subAccount?.accounts.find(acc => acc.id === request.accountId);
  const costCenter = project?.costCenters.find(cc => cc.id === request.costCenterId);
  const counterparty = project?.counterparties.find(cp => cp.id === request.counterpartyId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getAccountTypeLabel = (type: string) => {
    const types = {
      'bank_card': 'کارت بانکی',
      'bank_account': 'حساب بانکی',
      'cash': 'نقدی',
      'check': 'چک',
    };
    return types[type as keyof typeof types] || type;
  };

  const getCounterpartyTypeLabel = (type: string) => {
    const types = {
      'supplier': 'تأمین کننده',
      'contractor': 'پیمانکار',
      'other': 'سایر',
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">جزئیات درخواست پرداخت</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">اطلاعات کلی</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">شماره درخواست:</span>
                  <span className="font-medium">{request.requestNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاریخ ثبت:</span>
                  <span className="font-medium">{request.createdAt.toLocaleDateString('fa-IR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">زمان ثبت:</span>
                  <span className="font-medium">{request.createdAt.toLocaleTimeString('fa-IR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وضعیت:</span>
                  <span className={`font-medium ${
                    request.status === 'pending' ? 'text-yellow-600' :
                    request.status === 'approved' ? 'text-green-600' :
                    request.status === 'paid' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {request.status === 'pending' ? 'در انتظار تایید' :
                     request.status === 'approved' ? 'تایید شده' :
                     request.status === 'paid' ? 'پرداخت شده' : 'رد شده'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-3">اطلاعات مالی</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">مبلغ:</span>
                  <span className="font-bold text-blue-800">{formatCurrency(request.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نوع حساب:</span>
                  <span className="font-medium">{getAccountTypeLabel(request.accountType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">اطلاعات حساب:</span>
                  <span className="font-medium text-sm">{request.accountInfo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-red-800 mb-3">اطلاعات پروژه</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">پروژه:</span>
                  <span className="font-medium">{project?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">سرفصل:</span>
                  <span className="font-medium">{subAccount?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">معین:</span>
                  <span className="font-medium">{account?.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">مرکز هزینه:</span>
                  <span className="font-medium">{costCenter?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">طرف حساب:</span>
                  <span className="font-medium">{counterparty?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نوع طرف حساب:</span>
                  <span className="font-medium">{getCounterpartyTypeLabel(counterparty?.type || '')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">شرح درخواست</h3>
            <p className="text-gray-700 leading-relaxed">{request.description}</p>
          </div>

          {/* Documents */}
          {request.documents && request.documents.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-3">مستندات پیوست</h3>
              <div className="space-y-2">
                {request.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval Information */}
          {request.approvedBy && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-3">اطلاعات تایید</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">تایید شده توسط:</span>
                  <span className="font-medium">{request.approvedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاریخ تایید:</span>
                  <span className="font-medium">{request.approvedAt?.toLocaleDateString('fa-IR')}</span>
                </div>
                {request.rejectionReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">دلیل رد:</span>
                    <span className="font-medium text-red-600">{request.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              {canApprove ? (
                <>
                  <button
                    onClick={() => onReject(request.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    رد درخواست
                  </button>
                  <button
                    onClick={() => onApprove(request.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    تایید درخواست
                  </button>
                </>
              ) : (
                <div className="text-red-600 text-sm">
                  مبلغ این درخواست خارج از حد اختیار شما است
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentRequestModal;