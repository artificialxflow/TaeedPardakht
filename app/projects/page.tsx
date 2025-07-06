'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Account {
  id: string;
  name: string;
  code: string;
}

interface SubAccount {
  id: string;
  title: string;
  accounts: Account[];
}

interface CostCenter {
  id: string;
  name: string;
  code: string;
}

interface Counterparty {
  id: string;
  name: string;
  type: string;
  contactInfo: string;
}

export default function ProjectFormPage() {
  const [name, setName] = useState('');
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);

  // SubAccounts
  const addSubAccount = () => setSubAccounts([...subAccounts, { id: Date.now().toString(), title: '', accounts: [] }]);
  const updateSubAccount = (idx: number, value: string) => setSubAccounts(subAccounts.map((s, i) => i === idx ? { ...s, title: value } : s));
  const removeSubAccount = (idx: number) => setSubAccounts(subAccounts.filter((_, i) => i !== idx));

  // Accounts
  const addAccount = (subIdx: number) => setSubAccounts(subAccounts.map((s, i) => i === subIdx ? { ...s, accounts: [...s.accounts, { id: Date.now().toString(), name: '', code: '' }] } : s));
  const updateAccount = (subIdx: number, accIdx: number, field: 'name' | 'code', value: string) => setSubAccounts(subAccounts.map((s, i) => i === subIdx ? { ...s, accounts: s.accounts.map((a, j) => j === accIdx ? { ...a, [field]: value } : a) } : s));
  const removeAccount = (subIdx: number, accIdx: number) => setSubAccounts(subAccounts.map((s, i) => i === subIdx ? { ...s, accounts: s.accounts.filter((_, j) => j !== accIdx) } : s));

  // CostCenters
  const addCostCenter = () => setCostCenters([...costCenters, { id: Date.now().toString(), name: '', code: '' }]);
  const updateCostCenter = (idx: number, field: 'name' | 'code', value: string) => setCostCenters(costCenters.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  const removeCostCenter = (idx: number) => setCostCenters(costCenters.filter((_, i) => i !== idx));

  // Counterparties
  const addCounterparty = () => setCounterparties([...counterparties, { id: Date.now().toString(), name: '', type: '', contactInfo: '' }]);
  const updateCounterparty = (idx: number, field: 'name' | 'type' | 'contactInfo', value: string) => setCounterparties(counterparties.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  const removeCounterparty = (idx: number) => setCounterparties(counterparties.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('پروژه با موفقیت (به صورت mock) ثبت شد!');
  };

  return (
    <div className="container py-4" dir="rtl">
      <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
        <h2 className="mb-4 fw-bold text-dark">تعریف پروژه جدید</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">نام پروژه</label>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          {/* SubAccounts */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold">معین‌ها</label>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={addSubAccount}>افزودن معین</button>
            </div>
            {subAccounts.map((sub, i) => (
              <div key={sub.id} className="border rounded p-3 mb-2 bg-light">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <input type="text" className="form-control" placeholder="عنوان معین" value={sub.title} onChange={e => updateSubAccount(i, e.target.value)} />
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSubAccount(i)}>حذف</button>
                </div>
                <div className="mb-2">
                  <span className="fw-bold">حساب‌های زیرمجموعه:</span>
                  <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={() => addAccount(i)}>افزودن حساب</button>
                </div>
                {sub.accounts.map((acc, j) => (
                  <div key={acc.id} className="row g-2 mb-1 align-items-center">
                    <div className="col-md-5">
                      <input type="text" className="form-control" placeholder="نام حساب" value={acc.name} onChange={e => updateAccount(i, j, 'name', e.target.value)} />
                    </div>
                    <div className="col-md-5">
                      <input type="text" className="form-control" placeholder="کد حساب" value={acc.code} onChange={e => updateAccount(i, j, 'code', e.target.value)} />
                    </div>
                    <div className="col-md-2">
                      <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => removeAccount(i, j)}>حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Cost Centers */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold">مراکز هزینه</label>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={addCostCenter}>افزودن مرکز هزینه</button>
            </div>
            {costCenters.map((c, i) => (
              <div key={c.id} className="row g-2 mb-2 align-items-center bg-light rounded p-2">
                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="نام مرکز هزینه" value={c.name} onChange={e => updateCostCenter(i, 'name', e.target.value)} />
                </div>
                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="کد مرکز" value={c.code} onChange={e => updateCostCenter(i, 'code', e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => removeCostCenter(i)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
          {/* Counterparties */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold">طرف حساب‌ها</label>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={addCounterparty}>افزودن طرف حساب</button>
            </div>
            {counterparties.map((c, i) => (
              <div key={c.id} className="row g-2 mb-2 align-items-center bg-light rounded p-2">
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="نام طرف حساب" value={c.name} onChange={e => updateCounterparty(i, 'name', e.target.value)} />
                </div>
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="نوع (مثلاً تامین‌کننده)" value={c.type} onChange={e => updateCounterparty(i, 'type', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="اطلاعات تماس" value={c.contactInfo} onChange={e => updateCounterparty(i, 'contactInfo', e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => removeCounterparty(i)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-success">ثبت پروژه</button>
        </form>
      </div>
    </div>
  );
} 