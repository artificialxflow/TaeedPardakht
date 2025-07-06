'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const mockRequests = [
  { id: '1', number: '1001', project: 'پروژه الف', amount: 1200000, status: 'در انتظار تایید', description: 'خرید تجهیزات' },
  { id: '2', number: '1002', project: 'پروژه ب', amount: 500000, status: 'در انتظار تایید', description: 'پرداخت اجاره' },
];

export default function PaymentApprovalPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [alert, setAlert] = useState('');

  const handleAction = (id: string, status: 'تایید شده' | 'رد شده') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    setAlert(status === 'تایید شده' ? 'درخواست با موفقیت تایید شد.' : 'درخواست رد شد.');
    setTimeout(() => setAlert(''), 2500);
  };

  return (
    <div className="container py-4" dir="rtl">
      <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
        <h2 className="mb-4 fw-bold text-dark">تایید پرداخت‌ها</h2>
        {alert && <div className="alert alert-success">{alert}</div>}
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>شماره درخواست</th>
              <th>پروژه</th>
              <th>مبلغ</th>
              <th>توضیح</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.number}</td>
                <td>{r.project}</td>
                <td>{r.amount.toLocaleString('fa-IR')} تومان</td>
                <td>{r.description}</td>
                <td>
                  <span className={
                    r.status === 'در انتظار تایید' ? 'badge bg-warning text-dark' :
                    r.status === 'تایید شده' ? 'badge bg-success' :
                    'badge bg-danger'
                  }>{r.status}</span>
                </td>
                <td>
                  {r.status === 'در انتظار تایید' && (
                    <>
                      <button className="btn btn-sm btn-success ms-1" onClick={() => handleAction(r.id, 'تایید شده')}>تایید</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleAction(r.id, 'رد شده')}>رد</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 