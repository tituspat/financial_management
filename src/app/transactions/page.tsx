'use client';

import { useFinance } from '@/lib/finance-context';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Tabs, List } from '@/components/common';
import { Section, EmptyState } from '@/components/cards';
import { TransactionItem } from '@/components/domain';

export default function Transactions() {
  const router = useRouter();
  const { transactions, categories, accounts } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');

  // Group transactions by date
  const groupedByDate = transactions.reduce(
    (acc, txn) => {
      const date = txn.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(txn);
      return acc;
    },
    {} as Record<string, typeof transactions>
  );

  const sortedDates = Object.keys(groupedByDate).sort().reverse();
  const filteredDates = sortedDates.map((date) => ({
    date,
    txns: groupedByDate[date].filter((t) => filterType === 'all' || t.type === filterType),
  }));

  const getCategoryEmoji = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.emoji || '📝';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Other';
  };

  const getAccountName = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.name || 'Unknown';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

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

      <div className="px-6 space-y-5 pb-8">
        {filteredDates.every((d) => d.txns.length === 0) ? (
          <EmptyState icon="📭" title="No transactions yet" />
        ) : (
          filteredDates.map(({ date, txns }) => {
            if (txns.length === 0) return null;
            return (
              <Section key={date} title={`📅 ${formatDate(date)}`}>
                <List
                  items={txns.map((txn) => (
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
                />
              </Section>
            );
          })
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
