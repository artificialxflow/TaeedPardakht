import 'bootstrap/dist/css/bootstrap.min.css';

const paymentRequests = [
  {
    id: 1,
    requestNumber: 'REQ-001',
    description: 'درخواست پرداخت هزینه خرید تجهیزات',
    status: 'pending',
    amount: 1200000,
    createdAt: new Date(),
  },
  {
    id: 2,
    requestNumber: 'REQ-002',
    description: 'درخواست پرداخت حقوق پرسنل',
    status: 'approved',
    amount: 5000000,
    createdAt: new Date(),
  },
  {
    id: 3,
    requestNumber: 'REQ-003',
    description: 'درخواست پرداخت اجاره دفتر',
    status: 'paid',
    amount: 2000000,
    createdAt: new Date(),
  },
  {
    id: 4,
    requestNumber: 'REQ-004',
    description: 'درخواست پرداخت هزینه اینترنت',
    status: 'pending',
    amount: 300000,
    createdAt: new Date(),
  },
  {
    id: 5,
    requestNumber: 'REQ-005',
    description: 'درخواست پرداخت هزینه تبلیغات',
    status: 'paid',
    amount: 1500000,
    createdAt: new Date(),
  },
];

const user = {
  permissions: {
    canCreateRequest: true,
    canApprovePayment: true,
    canViewReports: true,
    canManageUsers: true,
  },
};

function formatCurrency(amount: number) {
  return amount.toLocaleString('fa-IR') + ' تومان';
}

export default function Home() {
  const stats = {
    totalRequests: paymentRequests.length,
    pendingRequests: paymentRequests.filter(r => r.status === 'pending').length,
    approvedRequests: paymentRequests.filter(r => r.status === 'approved').length,
    paidRequests: paymentRequests.filter(r => r.status === 'paid').length,
    totalAmount: paymentRequests.reduce((sum, r) => sum + r.amount, 0),
    paidAmount: paymentRequests.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="container py-4" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold text-dark">داشبورد</h1>
        <div className="text-secondary small">
          آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="bg-primary bg-opacity-10 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small">کل درخواست‌ها</div>
                <div className="h5 fw-bold text-dark">{stats.totalRequests}</div>
              </div>
              <span className="badge bg-primary p-3">📄</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="bg-warning bg-opacity-10 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small">در انتظار تایید</div>
                <div className="h5 fw-bold text-dark">{stats.pendingRequests}</div>
              </div>
              <span className="badge bg-warning p-3">⏳</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="bg-success bg-opacity-10 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small">تایید شده</div>
                <div className="h5 fw-bold text-dark">{stats.approvedRequests}</div>
              </div>
              <span className="badge bg-success p-3">✅</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="bg-info bg-opacity-10 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small">پرداخت شده</div>
                <div className="h5 fw-bold text-dark">{stats.paidRequests}</div>
              </div>
              <span className="badge bg-info p-3">💵</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview & Recent Requests */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm border p-4 h-100">
            <h3 className="h6 fw-bold mb-3 text-dark">بررسی مالی</h3>
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <span className="text-secondary">کل مبلغ درخواست‌ها:</span>
              <span className="fw-bold text-dark">{formatCurrency(stats.totalAmount)}</span>
            </div>
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <span className="text-secondary">مبلغ پرداخت شده:</span>
              <span className="fw-bold text-success">{formatCurrency(stats.paidAmount)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">باقی‌مانده:</span>
              <span className="fw-bold text-warning">
                {formatCurrency(stats.totalAmount - stats.paidAmount)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm border p-4 h-100">
            <h3 className="h6 fw-bold mb-3 text-dark">درخواست‌های اخیر</h3>
            <div className="vstack gap-2">
              {paymentRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="d-flex justify-content-between align-items-center bg-light rounded-2 p-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-pill me-2 ${
                      request.status === 'pending' ? 'bg-warning' :
                      request.status === 'approved' ? 'bg-success' :
                      request.status === 'paid' ? 'bg-info' : 'bg-danger'
                    }`}>&nbsp;</span>
                    <div>
                      <div className="fw-medium text-dark">{request.requestNumber}</div>
                      <div className="small text-secondary">{request.description.substring(0, 50)}...</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-dark">{formatCurrency(request.amount)}</div>
                    <div className="small text-secondary">{request.createdAt.toLocaleDateString('fa-IR')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
        <h3 className="h6 fw-bold mb-3 text-dark">دسترسی سریع</h3>
        <div className="row g-3">
          {user.permissions.canCreateRequest && (
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-primary w-100 py-3">
                <span className="fs-3">📄</span>
                <div className="fw-medium mt-2">درخواست جدید</div>
              </button>
            </div>
          )}
          {user.permissions.canApprovePayment && (
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-success w-100 py-3">
                <span className="fs-3">✅</span>
                <div className="fw-medium mt-2">تایید پرداخت</div>
              </button>
            </div>
          )}
          {user.permissions.canViewReports && (
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-info w-100 py-3">
                <span className="fs-3">📈</span>
                <div className="fw-medium mt-2">گزارشات</div>
              </button>
            </div>
          )}
          {user.permissions.canManageUsers && (
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-warning w-100 py-3">
                <span className="fs-3">👤</span>
                <div className="fw-medium mt-2">مدیریت کاربران</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
