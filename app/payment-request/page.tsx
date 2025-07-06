'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const mockProjects = [
  { id: '1', name: 'پروژه الف' },
  { id: '2', name: 'پروژه ب' },
];
const mockAccounts = [
  { id: '1', name: 'معین ۱' },
  { id: '2', name: 'معین ۲' },
];
const mockCostCenters = [
  { id: '1', name: 'مرکز هزینه ۱' },
  { id: '2', name: 'مرکز هزینه ۲' },
];
const mockCounterparties = [
  { id: '1', name: 'شرکت الف' },
  { id: '2', name: 'شرکت ب' },
];

export default function PaymentRequestPage() {
  const [form, setForm] = useState({
    project: '',
    date: new Date().toLocaleDateString('fa-IR'),
    requestNumber: Math.floor(Math.random() * 1000 + 1).toString(),
    description: '',
    amount: '',
    account: '',
    costCenter: '',
    counterparty: '',
    file: null as File | null,
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, file: e.target.files ? e.target.files[0] : null });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="container py-4" dir="rtl">
      <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
        <h2 className="mb-4 fw-bold text-dark">درخواست پرداخت جدید</h2>
        {success && <div className="alert alert-success">درخواست با موفقیت ثبت شد!</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">پروژه</label>
            <select className="form-select" name="project" value={form.project} onChange={handleChange} required>
              <option value="">انتخاب پروژه</option>
              {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="mb-3 row g-2">
            <div className="col-md-6">
              <label className="form-label">تاریخ</label>
              <input className="form-control" value={form.date} disabled />
            </div>
            <div className="col-md-6">
              <label className="form-label">شماره درخواست</label>
              <input className="form-control" value={form.requestNumber} disabled />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">شرح پرداخت</label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">مبلغ</label>
            <input type="number" className="form-control" name="amount" value={form.amount} onChange={handleChange} required />
          </div>
          <div className="mb-3 row g-2">
            <div className="col-md-4">
              <label className="form-label">معین</label>
              <select className="form-select" name="account" value={form.account} onChange={handleChange} required>
                <option value="">انتخاب معین</option>
                {mockAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">مرکز هزینه</label>
              <select className="form-select" name="costCenter" value={form.costCenter} onChange={handleChange} required>
                <option value="">انتخاب مرکز هزینه</option>
                {mockCostCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">طرف حساب</label>
              <select className="form-select" name="counterparty" value={form.counterparty} onChange={handleChange} required>
                <option value="">انتخاب طرف حساب</option>
                {mockCounterparties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">آپلود مستندات (پیش‌فاکتور و ...)</label>
            <input type="file" className="form-control" onChange={handleFile} />
          </div>
          <button type="submit" className="btn btn-success">ثبت درخواست</button>
        </form>
      </div>
    </div>
  );
} 