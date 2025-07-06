'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  access: {
    view: boolean;
    request: boolean;
    approve: boolean;
    manage: boolean;
  };
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'علی رضایی',
    email: 'ali@example.com',
    role: 'مدیر',
    access: { view: true, request: true, approve: true, manage: true },
  },
  {
    id: '2',
    name: 'مریم محمدی',
    email: 'maryam@example.com',
    role: 'کاربر',
    access: { view: true, request: true, approve: false, manage: false },
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newUser, setNewUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: '',
    access: { view: false, request: false, approve: false, manage: false },
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInput = (field: keyof User, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };
  const handleAccess = (field: keyof User['access'], value: boolean) => {
    setNewUser({ ...newUser, access: { ...newUser.access, [field]: value } });
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return;
    setUsers([...users, { ...newUser, id: Date.now().toString() }]);
    setNewUser({ id: '', name: '', email: '', role: '', access: { view: false, request: false, approve: false, manage: false } });
  };
  const editUser = (idx: number) => {
    setEditingIndex(idx);
    setNewUser(users[idx]);
  };
  const saveEdit = () => {
    if (editingIndex === null) return;
    setUsers(users.map((u, i) => (i === editingIndex ? newUser : u)));
    setEditingIndex(null);
    setNewUser({ id: '', name: '', email: '', role: '', access: { view: false, request: false, approve: false, manage: false } });
  };
  const deleteUser = (idx: number) => {
    setUsers(users.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
  };

  return (
    <div className="container py-4" dir="rtl">
      <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
        <h2 className="mb-4 fw-bold text-dark">مدیریت کاربران</h2>
        <div className="mb-5 p-4 bg-light rounded-3 shadow-sm">
          <h5 className="mb-3 fw-bold">{editingIndex === null ? 'افزودن کاربر جدید' : 'ویرایش کاربر'}</h5>
          <form className="row g-2 align-items-end">
            <div className="col-12 col-md-3">
              <input type="text" className="form-control" placeholder="نام" value={newUser.name} onChange={e => handleInput('name', e.target.value)} />
            </div>
            <div className="col-12 col-md-3">
              <input type="email" className="form-control" placeholder="ایمیل" value={newUser.email} onChange={e => handleInput('email', e.target.value)} />
            </div>
            <div className="col-12 col-md-2">
              <input type="text" className="form-control" placeholder="نقش" value={newUser.role} onChange={e => handleInput('role', e.target.value)} />
            </div>
            <div className="col-12 col-md-4 d-flex flex-wrap align-items-center gap-2">
              <span className="fw-bold ms-2">دسترسی‌ها:</span>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" checked={newUser.access.view} onChange={e => handleAccess('view', e.target.checked)} id="view" />
                <label className="form-check-label ms-1" htmlFor="view">مشاهده</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" checked={newUser.access.request} onChange={e => handleAccess('request', e.target.checked)} id="request" />
                <label className="form-check-label ms-1" htmlFor="request">ثبت درخواست</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" checked={newUser.access.approve} onChange={e => handleAccess('approve', e.target.checked)} id="approve" />
                <label className="form-check-label ms-1" htmlFor="approve">تایید پرداخت</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" checked={newUser.access.manage} onChange={e => handleAccess('manage', e.target.checked)} id="manage" />
                <label className="form-check-label ms-1" htmlFor="manage">مدیریت کاربران</label>
              </div>
            </div>
            <div className="col-12 col-md-auto mt-2 mt-md-0">
              {editingIndex === null ? (
                <button className="btn btn-primary w-100 w-md-auto" onClick={addUser} type="button">افزودن</button>
              ) : (
                <>
                  <button className="btn btn-success me-2 w-100 w-md-auto" onClick={saveEdit} type="button">ذخیره</button>
                  <button className="btn btn-secondary w-100 w-md-auto" onClick={() => { setEditingIndex(null); setNewUser({ id: '', name: '', email: '', role: '', access: { view: false, request: false, approve: false, manage: false } }); }} type="button">انصراف</button>
                </>
              )}
            </div>
          </form>
        </div>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr className="fw-bold">
              <th>نام</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>دسترسی‌ها</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.access.view && <span className="badge bg-info text-white rounded-pill px-3 py-1 ms-1">مشاهده</span>}
                  {user.access.request && <span className="badge bg-primary text-white rounded-pill px-3 py-1 ms-1">ثبت درخواست</span>}
                  {user.access.approve && <span className="badge bg-success text-white rounded-pill px-3 py-1 ms-1">تایید پرداخت</span>}
                  {user.access.manage && <span className="badge bg-warning text-dark rounded-pill px-3 py-1 ms-1">مدیریت کاربران</span>}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary ms-1" onClick={() => editUser(idx)}>ویرایش</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(idx)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 