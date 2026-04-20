'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  dummyUser,
  dummyCategories,
  dummyAccounts,
  dummyTransactions,
  dummyBudgets,
  dummyLoans,
  dummyInstallments,
  dummyTemplates,
  dummyRecurring,
  User,
  Category,
  Account,
  Transaction,
  Budget,
  Loan,
  Installment,
  Template,
  RecurringTransaction,
} from './dummy-data';

interface FinanceContextType {
  user: User;
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  loans: Loan[];
  installments: Installment[];
  templates: Template[];
  recurring: RecurringTransaction[];

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  editAccount: (id: string, account: Partial<Account>) => void;
  archiveAccount: (id: string) => void;
  addTemplate: (template: Omit<Template, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateInstallmentStatus: (id: string, status: 'paid' | 'pending') => void;
  confirmRecurringTransaction: (recurringId: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>(dummyUser);
  const [categories] = useState<Category[]>(dummyCategories);
  const [accounts, setAccounts] = useState<Account[]>(dummyAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(dummyBudgets);
  const [loans, setLoans] = useState<Loan[]>(dummyLoans);
  const [installments, setInstallments] = useState<Installment[]>(dummyInstallments);
  const [templates, setTemplates] = useState<Template[]>(dummyTemplates);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(dummyRecurring);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);

    // Update account balance
    setAccounts(
      accounts.map((acc) => {
        if (acc.id === transaction.accountId) {
          const sign = transaction.type === 'expense' ? -1 : 1;
          return {
            ...acc,
            balance: acc.balance + transaction.amount * sign,
          };
        }
        if (transaction.type === 'transfer' && acc.id === transaction.toAccountId) {
          return {
            ...acc,
            balance: acc.balance + transaction.amount,
          };
        }
        return acc;
      })
    );

    // Update budget if expense
    if (transaction.type === 'expense') {
      const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7);
      setBudgets(
        budgets.map((bud) => {
          if (bud.categoryId === transaction.categoryId && bud.month === currentMonth) {
            return {
              ...bud,
              spent: bud.spent + transaction.amount,
            };
          }
          return bud;
        })
      );
    }
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(
      transactions.map((txn) => (txn.id === id ? { ...txn, ...updates } : txn))
    );
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    setTransactions(transactions.filter((t) => t.id !== id));

    // Revert account balance
    setAccounts(
      accounts.map((acc) => {
        if (acc.id === transaction.accountId) {
          const sign = transaction.type === 'expense' ? 1 : -1;
          return {
            ...acc,
            balance: acc.balance + transaction.amount * sign,
          };
        }
        if (transaction.type === 'transfer' && acc.id === transaction.toAccountId) {
          return {
            ...acc,
            balance: acc.balance - transaction.amount,
          };
        }
        return acc;
      })
    );
  };

  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...account,
      id: `acc${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAccounts([...accounts, newAccount]);
  };

  const editAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(accounts.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc)));
  };

  const archiveAccount = (id: string) => {
    editAccount(id, { archived: true });
  };

  const addTemplate = (template: Omit<Template, 'id'>) => {
    const newTemplate: Template = {
      ...template,
      id: `tpl${Date.now()}`,
    };
    setTemplates([...templates, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: `bud${Date.now()}`,
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map((bud) => (bud.id === id ? { ...bud, ...updates } : bud)));
  };

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loan,
      id: `loan${Date.now()}`,
    };
    setLoans([...loans, newLoan]);
  };

  const updateInstallmentStatus = (id: string, status: 'paid' | 'pending') => {
    setInstallments(
      installments.map((inst) => {
        if (inst.id === id) {
          return {
            ...inst,
            status,
            paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return inst;
      })
    );
  };

  const confirmRecurringTransaction = (recurringId: string) => {
    const rec = recurring.find((r) => r.id === recurringId);
    const template = templates.find((t) => t.id === rec?.templateId);
    if (!rec || !template) return;

    addTransaction({
      accountId: template.accountId,
      categoryId: template.categoryId,
      type: template.type,
      amount: template.amount,
      description: template.description || template.name,
      date: new Date().toISOString().split('T')[0],
      toAccountId: undefined,
    });

    setRecurring(
      recurring.map((r) => {
        if (r.id === recurringId) {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return {
            ...r,
            lastConfirmedDate: new Date().toISOString().split('T')[0],
            nextDueDate: nextMonth.toISOString().split('T')[0],
          };
        }
        return r;
      })
    );
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        categories,
        accounts,
        transactions,
        budgets,
        loans,
        installments,
        templates,
        recurring,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addAccount,
        editAccount,
        archiveAccount,
        addTemplate,
        deleteTemplate,
        addBudget,
        updateBudget,
        addLoan,
        updateInstallmentStatus,
        confirmRecurringTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
