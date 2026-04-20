'use client';

import { useFinance } from '@/lib/finance-context';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';
import { PageHeader, Grid } from '@/components/common';
import { Card, CardBody, Section, Stat } from '@/components/cards';
import { Button } from '@/components/ui/index';
import { BudgetItem } from '@/components/domain';

export default function Dashboard() {
  const { accounts, transactions, categories, budgets } = useFinance();

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Get this month's income and expenses
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(currentMonth));
  const income = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netIncome = income - expenses;

  // Get budgets sorted by percentage (smallest first)
  const monthBudgets = budgets
    .filter((b) => b.month === currentMonth)
    .map((budget) => {
      const percentage = (budget.spent / budget.limit) * 100;
      return { ...budget, percentage };
    })
    .sort((a, b) => a.percentage - b.percentage);

  const getCategoryEmoji = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.emoji || '📝';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Other';
  };

  const monthName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full">
      <PageHeader
        title="FinTracker"
        subtitle={`${monthName}`}
        showSettings={true}
      />

      <div className="px-6 space-y-6">
        {/* Monthly Summary Card */}
        <Card>
          <CardBody className="space-y-4">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
                Monthly Net
              </p>
              <h2 className={`text-4xl font-bold break-words overflow-hidden ${
                netIncome >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {formatCurrency(netIncome)}
              </h2>
            </div>

            {/* Income and Expenses Row */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <Grid columns={2} gap="md">
                <Stat
                  label="Total Income"
                  value={formatCurrency(income)}
                  icon="💵"
                />
                <Stat
                  label="Total Expenses"
                  value={formatCurrency(expenses)}
                  icon="💸"
                />
              </Grid>
            </div>
          </CardBody>
        </Card>

        {/* Budget Section */}
        <Section title="Budget Overview" subtitle={`Sorted by progress (lowest to highest)`}>
          {monthBudgets.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                No budgets set for this month
              </p>
              <Link href="/budgets">
                <Button variant="primary" size="sm">
                  Create Budget
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {monthBudgets.map((budget) => (
                <BudgetItem
                  key={budget.id}
                  categoryEmoji={getCategoryEmoji(budget.categoryId)}
                  categoryName={getCategoryName(budget.categoryId)}
                  spent={budget.spent}
                  limit={budget.limit}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Quick Actions */}
        <div className="flex gap-3 pb-6">
          <Link href="/add" className="flex-1">
            <Button variant="primary" fullWidth size="lg">
              ➕ Add Transaction
            </Button>
          </Link>
          <Link href="/transactions" className="flex-1">
            <Button variant="secondary" fullWidth size="lg">
              📜 View History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
