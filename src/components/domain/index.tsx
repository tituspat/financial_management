'use client';

import { formatCurrency } from '@/lib/currency';
import { Card, CardBody, ProgressBar } from '@/components/cards';
import React from 'react';

interface TransactionItemProps {
  id: string;
  categoryEmoji: string;
  categoryName: string;
  accountName: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  date: string;
  onClick?: () => void;
}

export function TransactionItem({
  id,
  categoryEmoji,
  categoryName,
  accountName,
  amount,
  type,
  date,
  onClick,
}: TransactionItemProps) {
  const textColor =
    type === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <Card
      hover
      className="p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
            {categoryEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {categoryName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{accountName}</p>
          </div>
        </div>
        <div>
          <p className={`font-bold text-sm min-w-max ${textColor}`}>
            {type === 'expense' ? '-' : '+'}
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
    </Card>
  );
}

interface BudgetItemProps {
  categoryEmoji: string;
  categoryName: string;
  spent: number;
  limit: number;
  onEdit?: () => void;
}

export function BudgetItem({
  categoryEmoji,
  categoryName,
  spent,
  limit,
  onEdit,
}: BudgetItemProps) {
  const percentage = (spent / limit) * 100;
  const isOverBudget = spent > limit;
  const isNearLimit = percentage >= 80;
  const remaining = limit - spent;

  const variantColor = isOverBudget ? 'danger' : isNearLimit ? 'warning' : 'success';

  return (
    <Card hover onClick={onEdit} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-lg">
            {categoryEmoji}
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">{categoryName}</h3>
        </div>
        <div className="text-right">
          <p
            className={`font-bold text-sm break-words overflow-hidden ${
              isOverBudget
                ? 'text-rose-600 dark:text-rose-400'
                : isNearLimit
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatCurrency(spent)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">of {formatCurrency(limit)}</p>
        </div>
      </div>
      <ProgressBar value={spent} max={limit} variant={variantColor} showLabel={false} />
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {Math.round(percentage)}% • {isOverBudget
          ? `Over by ${formatCurrency(spent - limit)}`
          : `${formatCurrency(remaining)} remaining`}
      </p>
    </Card>
  );
}

interface AccountItemProps {
  name: string;
  type: 'checking' | 'savings' | 'credit_card';
  balance: number;
  transactionCount: number;
  onArchive?: () => void;
}

export function AccountItem({
  name,
  type,
  balance,
  transactionCount,
  onArchive,
}: AccountItemProps) {
  const typeIcons = {
    checking: '🏦',
    savings: '🏧',
    credit_card: '💳',
  };

  return (
    <Card hover className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-lg">
            {typeIcons[type]}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{transactionCount} transactions</p>
          </div>
        </div>
        {onArchive && (
          <button
            onClick={onArchive}
            className="text-xs text-slate-500 hover:text-rose-600 transition font-medium"
          >
            Archive
          </button>
        )}
      </div>
      <p
        className={`text-3xl font-bold break-words overflow-hidden ${
          balance >= 0
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-rose-600 dark:text-rose-400'
        }`}
      >
        {formatCurrency(balance)}
      </p>
    </Card>
  );
}

interface LoanItemProps {
  name: string;
  principal: number;
  remainingBalance: number;
  interestRate: number;
  accountName: string;
  paidInstallments: number;
  totalInstallments: number;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export function LoanItem({
  name,
  principal,
  remainingBalance,
  interestRate,
  accountName,
  paidInstallments,
  totalInstallments,
  isExpanded,
  onToggle,
  children,
}: LoanItemProps) {
  const progress = (paidInstallments / totalInstallments) * 100;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition flex justify-between items-start text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-lg">
              💳
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            {accountName} • {interestRate}% APR
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-600 dark:text-slate-400">Principal</p>
              <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(principal)}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400">Balance</p>
              <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(remainingBalance)}</p>
            </div>
          </div>
        </div>
        <span className={`text-slate-400 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && children && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/20">
          {children}
        </div>
      )}
    </Card>
  );
}
