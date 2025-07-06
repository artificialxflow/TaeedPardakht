import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    role: 'admin',
    permissions: {
      canCreateRequest: true,
      canApprovePayment: true,
      canMakePayment: true,
      canViewReports: true,
      canManageUsers: true,
      maxApprovalAmount: 1000000,
      maxPaymentAmount: 1000000,
    },
    projects: ['proj1', 'proj2'],
  },
  {
    id: '2',
    username: 'requester',
    email: 'requester@company.com',
    role: 'requester',
    permissions: {
      canCreateRequest: true,
      canApprovePayment: false,
      canMakePayment: false,
      canViewReports: true,
      canManageUsers: false,
    },
    projects: ['proj1'],
  },
  {
    id: '3',
    username: 'approver',
    email: 'approver@company.com',
    role: 'approver',
    permissions: {
      canCreateRequest: false,
      canApprovePayment: true,
      canMakePayment: false,
      canViewReports: true,
      canManageUsers: false,
      maxApprovalAmount: 500000,
    },
    projects: ['proj1', 'proj2'],
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.username === username);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};