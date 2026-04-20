'use client';

import { useFinance } from '@/lib/finance-context';
import Link from 'next/link';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Tabs, List } from '@/components/common';
import { Section, EmptyState } from '@/components/cards';
import { TransactionItem } from '@/components/domain';

export default function Transactions() {
  const router = useRouter();
  const { transactions, categories, accounts } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');

  // Memoize category map
  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  // Memoize account map
  const accountMap = useMemo(() => {
    return new Map(accounts.map((a) => [a.id, a]));
  }, [accounts]);

  // Memoize helper functions
  const getCategoryEmoji = useCallback(
    (categoryId: string) => categoryMap.get(categoryId)?.emoji || '📝',
    [categoryMap]
  );

  const getCategoryName = useCallback(
    (categoryId: string) => categoryMap.get(categoryId)?.name || 'Other',
    [categoryMap]
  );

  const getAccountName = useCallback(
    (accountId: string) => accountMap.get(accountId)?.name || 'Unknown',
    [accountMap]
  );

  const formatDate = useCallback((dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Memoize grouped and filtered data
  const filteredDates = useMemo(() => {
    const grouped = transactions.reduce(
      (acc, txn) => {
        const date = txn.date;
        if (!acc[date]) acc[date] = [];
        if (filterType === 'all' || txn.type === filterType) {
          acc[date].push(txn);
        }
        return acc;
      },
      {} as Record<string, typeof transactions>
    );

    return Object.keys(grouped)
      .sort()
      .reverse()
      .map((date) => ({
        date,
        txns: grouped[date],
      }));
  }, [transactions, filterType]);

  const tabItems = [
    { id: 'all', label: 'All', icon: '📊' },
    { id: 'expense', label: 'Expenses', icon: '💸' },
    { id: 'income', label: 'Income', icon: '💵' },
    { id: 'transfer', label: 'Transfers', icon: '↔️' },
  ];

  return (
    <div className="w-full">
      <PageHeader title="Transaction History" subtitle="View & manage all transactions" />

      <Tabs
        tabs={tabItems}
        active={filterType}
        onChange={(id) => setFilterType(id as typeof filterType)}
      />

      <div className="px-6 space-y-4 pb-8">
        {filteredDates.every((d) => d.txns.length === 0) ? (
          <EmptyState icon="📭" title="No transactions yet" />
        ) : (
          filteredDates.map(({ date, txns }) => (
            <Section key={date} title={`📅 ${formatDate(date)}`}>
              <div className="space-y-1">
                {txns.map((txn) => (
                  <TransactionItem
                    key={txn.id}
                    id={txn.id}
                    categoryEmoji={getCategoryEmoji(txn.categoryId)}
                    categoryName={
                      txn.type === 'transfer'
                        ? `Transfer to ${getAccountName(txn.toAccountId || '')}`
                        : getCategoryName(txn.categoryId)
                    }
                    accountName={getAccountName(txn.accountId)}
                    amount={txn.amount}
                    type={txn.type}
                    date={txn.date}
                    onClick={() => router.push(`/transactions/${txn.id}`)}
                  />
                ))}
              </div>
            </Section>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Link
        href="/add"
        className="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Add Transaction"
      >
        ➕
      </Link>
    </div>
  );
}
