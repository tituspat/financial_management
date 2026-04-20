'use client';

import { useFinance } from '@/lib/finance-context';
import { formatCurrency } from '@/lib/currency';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardBody, Section } from '@/components/cards';
import { Button, Input } from '@/components/ui/index';

export default function TransactionDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { transactions, categories, accounts, deleteTransaction, editTransaction } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState('');

  const transaction = transactions.find((t) => t.id === params.id);

  if (!transaction) {
    return (
      <div className="w-full">
        <PageHeader title="Transaction Not Found" />
        <div className="px-6 py-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This transaction doesn't exist.
          </p>
          <Button variant="primary" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === transaction.categoryId);
  const account = accounts.find((a) => a.id === transaction.accountId);
  const toAccount = transaction.toAccountId
    ? accounts.find((a) => a.id === transaction.toAccountId)
    : null;

  const handleSaveEdit = () => {
    if (!editAmount || parseFloat(editAmount) <= 0) return;
    editTransaction(transaction.id, { amount: parseFloat(editAmount) });
    setIsEditing(false);
    router.back();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
      router.back();
    }
  };

  const typeLabel = {
    expense: '💸 Expense',
    income: '💵 Income',
    transfer: '↔️ Transfer',
  };

  const typeColor = {
    expense: 'text-rose-600 dark:text-rose-400',
    income: 'text-emerald-600 dark:text-emerald-400',
    transfer: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className="w-full">
      <PageHeader title="Transaction Details" />

      <div className="px-6 space-y-5">
        {/* Amount Section */}
        <Card>
          <CardBody className="text-center py-8">
            <p className={`text-sm font-medium mb-2 ${typeColor[transaction.type]}`}>
              {typeLabel[transaction.type]}
            </p>
            {isEditing ? (
              <div className="flex gap-2 items-center justify-center">
                <div className="relative w-40">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="1"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-center font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <h2
                className={`text-4xl font-bold ${
                  transaction.type === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </h2>
            )}
          </CardBody>
        </Card>

        {/* Details Section */}
        <Section title="Details">
          <div className="space-y-3">
            {/* Category */}
            {category && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.emoji}</span>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Category
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">{category.name}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* From Account */}
            {account && (
              <Card className="p-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                    {transaction.type === 'transfer' ? 'From Account' : 'Account'}
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">{account.name}</p>
                </div>
              </Card>
            )}

            {/* To Account (for transfers) */}
            {toAccount && (
              <Card className="p-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                    To Account
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">{toAccount.name}</p>
                </div>
              </Card>
            )}

            {/* Date */}
            <Card className="p-4">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Date
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {new Date(transaction.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </Card>

            {/* Description */}
            {transaction.description && (
              <Card className="p-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Description
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {transaction.description}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </Section>

        {/* Action Buttons */}
        <Section>
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setIsEditing(false);
                  setEditAmount('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSaveEdit}
                disabled={!editAmount || parseFloat(editAmount) <= 0}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setIsEditing(true);
                  setEditAmount(transaction.amount.toString());
                }}
              >
                ✎ Edit
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleDelete}
              >
                🗑️ Delete
              </Button>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
