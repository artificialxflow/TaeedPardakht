import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, PaymentRequest, User } from '../types';

interface DataContextType {
  projects: Project[];
  paymentRequests: PaymentRequest[];
  users: User[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addPaymentRequest: (request: PaymentRequest) => void;
  updatePaymentRequest: (id: string, request: Partial<PaymentRequest>) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockProjects: Project[] = [
  {
    id: 'proj1',
    name: 'پروژه ساختمان اداری',
    subAccounts: [
      {
        id: 'sub1',
        title: 'مواد و تجهیزات',
        accounts: [
          { id: 'acc1', name: 'سیمان و آجر', code: '001' },
          { id: 'acc2', name: 'تجهیزات برقی', code: '002' },
        ],
      },
      {
        id: 'sub2',
        title: 'خدمات',
        accounts: [
          { id: 'acc3', name: 'طراحی و نظارت', code: '003' },
          { id: 'acc4', name: 'حمل و نقل', code: '004' },
        ],
      },
    ],
    costCenters: [
      { id: 'cost1', name: 'طبقه اول', code: 'FL1' },
      { id: 'cost2', name: 'طبقه دوم', code: 'FL2' },
    ],
    counterparties: [
      { id: 'counter1', name: 'شرکت سازنده ABC', type: 'contractor', contactInfo: '09123456789' },
      { id: 'counter2', name: 'تأمین کننده مواد XYZ', type: 'supplier', contactInfo: '09987654321' },
    ],
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin',
  },
];

const mockRequests: PaymentRequest[] = [
  {
    id: 'req1',
    requestNumber: '2024-01-001',
    projectId: 'proj1',
    subAccountId: 'sub1',
    accountId: 'acc1',
    costCenterId: 'cost1',
    counterpartyId: 'counter1',
    description: 'خرید سیمان برای عملیات بتن‌ریزی طبقه اول',
    amount: 15000000,
    accountType: 'کارت بانکی',
    accountInfo: 'کارت ملت - 6037-****-****-1234',
    documents: [],
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    createdBy: 'requester',
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(mockRequests);
  const [users, setUsers] = useState<User[]>([]);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addPaymentRequest = (request: PaymentRequest) => {
    setPaymentRequests(prev => [...prev, request]);
  };

  const updatePaymentRequest = (id: string, updatedRequest: Partial<PaymentRequest>) => {
    setPaymentRequests(prev => prev.map(r => r.id === id ? { ...r, ...updatedRequest } : r));
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedUser } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <DataContext.Provider value={{
      projects,
      paymentRequests,
      users,
      addProject,
      updateProject,
      deleteProject,
      addPaymentRequest,
      updatePaymentRequest,
      addUser,
      updateUser,
      deleteUser,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};