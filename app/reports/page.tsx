'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const mockReports = [
  { id: '1', number: '1001', project: 'پروژه الف', amount: 1200000, status: 'تایید شده', approver: 'علی رضایی', payer: 'مریم محمدی', file: 'file1.pdf' },
  { id: '2', number: '1002', project: 'پروژه ب', amount: 500000, status: 'رد شده', approver: 'مریم محمدی', payer: 'علی رضایی', file: 'file2.pdf' },
];

export default function ReportsPage() {
  const [reports] = useState(mockReports);
  const [alert, setAlert] = useState('');

  const handleExport = () => {
    setAlert('خروجی اکسل به صورت آزمایشی ایجاد شد!');
    setTimeout(() => setAlert(''), 2500);
  };

  return (
    <div className="container py-4" dir="rtl">
      <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
        <h2 className="mb-4 fw-bold text-dark">گزارشات پرداخت</h2>
        {alert && <div className="alert alert-info">{alert}</div>}
        <button className="btn btn-outline-success mb-3" onClick={handleExport}>خروجی اکسل</button>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>شماره درخواست</th>
              <th>پروژه</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>تاییدکننده</th>
              <th>پرداخت‌کننده</th>
              <th>مستندات</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td>{r.number}</td>
                <td>{r.project}</td>
                <td>{r.amount.toLocaleString('fa-IR')} تومان</td>
                <td>
                  <span className={
                    r.status === 'تایید شده' ? 'badge bg-success' :
                    r.status === 'رد شده' ? 'badge bg-danger' :
                    'badge bg-warning text-dark'
                  }>{r.status}</span>
                </td>
                <td>{r.approver}</td>
                <td>{r.payer}</td>
                <td>
                  <a href={`/${r.file}`} download className="btn btn-sm btn-outline-primary">دانلود</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 