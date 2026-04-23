// Dummy data for the financial management app

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'cash' | 'bank' | 'savings' | 'credit_card' | 'e-wallet' | 'investments' | 'loan';
  currency: string;
  archived: boolean;
  createdAt: string;
  loanMetadata?: {
    principal: number;
    interestRate: number;
    tenure: number;
    startDate: string;
    status: 'active' | 'closed';
  };
}

export interface SubCategory {
  id: string;
  name: string;
  emoji?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  emoji: string;
  color: string;
  subCategories?: SubCategory[];
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  toAccountId?: string;
  subCategoryId?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: string; // YYYY-MM
  limit: number;
  spent: number;
}

export interface Installment {
  id: string;
  loanId: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid';
  transactionId?: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  accountId: string;
  description?: string;
}

export interface RecurringTransaction {
  id: string;
  templateId: string;
  frequency: 'monthly';
  nextDueDate: string;
  active: boolean;
  lastConfirmedDate?: string;
}

// DUMMY DATA
const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

export const dummyUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
};

export const dummyCategories: Category[] = [
  // Expenses
  { id: 'cat1', name: 'Coffee', type: 'expense', emoji: '☕', color: '#8B4513' },
  {
    id: 'cat2',
    name: 'Transport',
    type: 'expense',
    emoji: '🚗',
    color: '#FF6B6B',
    subCategories: [
      { id: 'subcat2-1', name: 'Taxi', emoji: '🚕' },
      { id: 'subcat2-2', name: 'Public Transit', emoji: '🚌' },
      { id: 'subcat2-3', name: 'Fuel', emoji: '⛽' },
    ],
  },
  {
    id: 'cat3',
    name: 'Groceries',
    type: 'expense',
    emoji: '🛒',
    color: '#51CF66',
    subCategories: [
      { id: 'subcat3-1', name: 'Supermarket', emoji: '🏪' },
      { id: 'subcat3-2', name: 'Market', emoji: '🏬' },
      { id: 'subcat3-3', name: 'Online', emoji: '💻' },
    ],
  },
  { id: 'cat4', name: 'Entertainment', type: 'expense', emoji: '🎬', color: '#FFD93D' },
  { id: 'cat5', name: 'Utilities', type: 'expense', emoji: '💡', color: '#A8E6CF' },
  {
    id: 'cat6',
    name: 'Dining',
    type: 'expense',
    emoji: '🍽️',
    color: '#FF6B9D',
    subCategories: [
      { id: 'subcat6-1', name: 'Restaurant', emoji: '🍽️' },
      { id: 'subcat6-2', name: 'Cafe', emoji: '☕' },
      { id: 'subcat6-3', name: 'Fast Food', emoji: '🍔' },
      { id: 'subcat6-4', name: 'Delivery', emoji: '🛵' },
    ],
  },
  // Income
  { id: 'cat7', name: 'Salary', type: 'income', emoji: '💰', color: '#00B894' },
  { id: 'cat8', name: 'Freelance', type: 'income', emoji: '💻', color: '#0984E3' },
  { id: 'cat9', name: 'Bonus', type: 'income', emoji: '🎁', color: '#FDCB6E' },
];

export const dummyAccounts: Account[] = [
  {
    id: 'acc1',
    name: 'Checking Account',
    balance: 5250750,
    type: 'bank',
    currency: 'IDR',
    archived: false,
    createdAt: '2024-01-15',
  },
  {
    id: 'acc2',
    name: 'Savings',
    balance: 12500000,
    type: 'savings',
    currency: 'IDR',
    archived: false,
    createdAt: '2024-01-15',
  },
  {
    id: 'acc3',
    name: 'Credit Card',
    balance: -850500,
    type: 'credit_card',
    currency: 'IDR',
    archived: false,
    createdAt: '2024-02-01',
  },
  {
    id: 'loan1',
    name: 'Car Loan',
    balance: 135000000,
    type: 'loan',
    currency: 'IDR',
    archived: false,
    createdAt: '2024-01-15',
    loanMetadata: {
      principal: 150000000,
      interestRate: 5.5,
      tenure: 60,
      startDate: '2024-01-15',
      status: 'active',
    },
  },
  {
    id: 'loan2',
    name: 'Personal Loan',
    balance: 48000000,
    type: 'loan',
    currency: 'IDR',
    archived: false,
    createdAt: '2024-02-01',
    loanMetadata: {
      principal: 50000000,
      interestRate: 8.0,
      tenure: 24,
      startDate: '2024-02-01',
      status: 'active',
    },
  },
];

export const dummyTransactions: Transaction[] = [
  // Today
  {
    id: 'txn1',
    accountId: 'acc1',
    categoryId: 'cat1',
    type: 'expense',
    amount: 55000,
    description: 'Morning coffee',
    date: today.toISOString().split('T')[0],
    createdAt: today.toISOString(),
  },
  {
    id: 'txn2',
    accountId: 'acc1',
    categoryId: 'cat2',
    type: 'expense',
    amount: 80000,
    description: 'Taxi to office',
    date: today.toISOString().split('T')[0],
    createdAt: today.toISOString(),
  },
  // Yesterday
  {
    id: 'txn3',
    accountId: 'acc1',
    categoryId: 'cat3',
    type: 'expense',
    amount: 453000,
    description: 'Weekly groceries',
    date: new Date(today.getTime() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(today.getTime() - 86400000).toISOString(),
  },
  {
    id: 'txn4',
    accountId: 'acc1',
    categoryId: 'cat6',
    type: 'expense',
    amount: 325000,
    description: 'Dinner with friends',
    date: new Date(today.getTime() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(today.getTime() - 86400000).toISOString(),
  },
  // This week
  {
    id: 'txn5',
    accountId: 'acc1',
    categoryId: 'cat7',
    type: 'income',
    amount: 3500000,
    description: 'Monthly salary',
    date: new Date(today.getTime() - 259200000).toISOString().split('T')[0],
    createdAt: new Date(today.getTime() - 259200000).toISOString(),
  },
  {
    id: 'txn6',
    accountId: 'acc1',
    categoryId: 'cat4',
    type: 'expense',
    amount: 159900,
    description: 'Movie ticket',
    date: new Date(today.getTime() - 345600000).toISOString().split('T')[0],
    createdAt: new Date(today.getTime() - 345600000).toISOString(),
  },
  // Last week
  {
    id: 'txn7',
    accountId: 'acc1',
    categoryId: 'cat5',
    type: 'expense',
    amount: 1200000,
    description: 'Electricity bill',
    date: new Date(today.getTime() - 604800000).toISOString().split('T')[0],
    createdAt: new Date(today.getTime() - 604800000).toISOString(),
  },
];

export const dummyBudgets: Budget[] = [
  {
    id: 'bud1',
    categoryId: 'cat1',
    month: currentMonth,
    limit: 1000000,
    spent: 355000,
  },
  {
    id: 'bud2',
    categoryId: 'cat2',
    month: currentMonth,
    limit: 2000000,
    spent: 1280000,
  },
  {
    id: 'bud3',
    categoryId: 'cat3',
    month: currentMonth,
    limit: 3000000,
    spent: 1453000,
  },
  {
    id: 'bud4',
    categoryId: 'cat4',
    month: currentMonth,
    limit: 1500000,
    spent: 559900,
  },
  {
    id: 'bud5',
    categoryId: 'cat6',
    month: currentMonth,
    limit: 2500000,
    spent: 1925000,
  },
];

// Generate installments for loans
export const dummyInstallments: Installment[] = [
  // Car loan installments
  {
    id: 'inst1',
    loanId: 'loan1',
    installmentNumber: 1,
    amount: 2768300,
    dueDate: '2024-02-15',
    paidDate: '2024-02-15',
    status: 'paid',
  },
  {
    id: 'inst2',
    loanId: 'loan1',
    installmentNumber: 2,
    amount: 2768300,
    dueDate: '2024-03-15',
    paidDate: '2024-03-14',
    status: 'paid',
  },
  {
    id: 'inst3',
    loanId: 'loan1',
    installmentNumber: 3,
    amount: 2768300,
    dueDate: '2024-04-15',
    status: 'pending',
  },
  {
    id: 'inst4',
    loanId: 'loan1',
    installmentNumber: 4,
    amount: 2768300,
    dueDate: '2024-05-15',
    status: 'pending',
  },
  // Personal loan installments
  {
    id: 'inst5',
    loanId: 'loan2',
    installmentNumber: 1,
    amount: 2272700,
    dueDate: '2024-03-01',
    paidDate: '2024-03-01',
    status: 'paid',
  },
  {
    id: 'inst6',
    loanId: 'loan2',
    installmentNumber: 2,
    amount: 2272700,
    dueDate: '2024-04-01',
    status: 'pending',
  },
];

export const dummyTemplates: Template[] = [
  {
    id: 'tpl1',
    name: 'Coffee',
    type: 'expense',
    amount: 55000,
    categoryId: 'cat1',
    accountId: 'acc1',
    description: 'Morning coffee',
  },
  {
    id: 'tpl2',
    name: 'Uber',
    type: 'expense',
    amount: 100000,
    categoryId: 'cat2',
    accountId: 'acc1',
    description: 'Daily commute',
  },
  {
    id: 'tpl3',
    name: 'Groceries',
    type: 'expense',
    amount: 450000,
    categoryId: 'cat3',
    accountId: 'acc1',
    description: 'Weekly shopping',
  },
];

export const dummyRecurring: RecurringTransaction[] = [
  {
    id: 'rec1',
    templateId: 'tpl1',
    frequency: 'monthly',
    nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 1)
      .toISOString()
      .split('T')[0],
    active: true,
  },
  {
    id: 'rec2',
    templateId: 'tpl3',
    frequency: 'monthly',
    nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 7)
      .toISOString()
      .split('T')[0],
    active: true,
    lastConfirmedDate: today.toISOString().split('T')[0],
  },
];
