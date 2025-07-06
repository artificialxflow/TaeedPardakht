export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'requester' | 'approver' | 'payer';
  permissions: {
    canCreateRequest: boolean;
    canApprovePayment: boolean;
    canMakePayment: boolean;
    canViewReports: boolean;
    canManageUsers: boolean;
    maxApprovalAmount?: number;
    maxPaymentAmount?: number;
  };
  projects: string[];
}

export interface Project {
  id: string;
  name: string;
  subAccounts: SubAccount[];
  costCenters: CostCenter[];
  counterparties: Counterparty[];
  createdAt: Date;
  createdBy: string;
}

export interface SubAccount {
  id: string;
  title: string;
  accounts: Account[];
}

export interface Account {
  id: string;
  name: string;
  code: string;
}

export interface CostCenter {
  id: string;
  name: string;
  code: string;
}

export interface Counterparty {
  id: string;
  name: string;
  type: 'supplier' | 'contractor' | 'other';
  contactInfo: string;
}

export interface PaymentRequest {
  id: string;
  requestNumber: string;
  projectId: string;
  subAccountId: string;
  accountId: string;
  costCenterId: string;
  counterpartyId: string;
  description: string;
  amount: number;
  accountType: string;
  accountInfo: string;
  documents: Document[];
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: Date;
  createdBy: string;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  paidAt?: Date;
  paidBy?: string;
  paymentReceipt?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
  status?: string;
  counterpartyId?: string;
  costCenterId?: string;
}