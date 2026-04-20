'use client';

import { useFinance } from '@/lib/finance-context';
import { formatCurrency } from '@/lib/currency';
import { PageHeader } from '@/components/common';
import { Card, CardBody, Section, EmptyState } from '@/components/cards';
import { Button } from '@/components/ui/index';

export default function Suggestions() {
  const { transactions, categories, budgets, accounts } = useFinance();

  // Calculate spending patterns
  const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7);
  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(currentMonth) && t.type === 'expense');

  // Get category-wise spending
  const categorySpending = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const spent = monthlyTransactions
        .filter((t) => t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const budget = budgets.find((b) => b.categoryId === cat.id && b.month === currentMonth);
      return {
        category: cat,
        spent,
        budget: budget?.limit || 0,
        percentage: budget ? (spent / budget.limit) * 100 : 0,
      };
    })
    .filter((item) => item.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  // Generate suggestions
  const suggestions: Array<{
    type: 'warning' | 'tip' | 'insight';
    icon: string;
    title: string;
    description: string;
    action?: string;
  }> = [];

  // Check over-budget categories
  categorySpending.forEach((item) => {
    if (item.percentage > 100) {
      suggestions.push({
        type: 'warning',
        icon: '⚠️',
        title: `Over budget on ${item.category.name}`,
        description: `You've spent ${formatCurrency(item.spent)} out of ${formatCurrency(item.budget)} (${Math.round(item.percentage)}%)`,
      });
    } else if (item.percentage >= 80) {
      suggestions.push({
        type: 'warning',
        icon: '🔔',
        title: `Approaching limit on ${item.category.name}`,
        description: `${Math.round(100 - item.percentage)}% of your budget remaining`,
      });
    }
  });

  // Spending trend insights
  const topSpending = categorySpending[0];
  if (topSpending && topSpending.spent > 0) {
    const percentOfTotal = (topSpending.spent / monthlyTransactions.reduce((sum, t) => sum + t.amount, 0)) * 100;
    if (percentOfTotal > 30) {
      suggestions.push({
        type: 'insight',
        icon: '💰',
        title: `${topSpending.category.name} is your top expense`,
        description: `It accounts for ${Math.round(percentOfTotal)}% of your total spending this month`,
      });
    }
  }

  // Balance suggestions
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalMonthlyExpense = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
  if (totalMonthlyExpense > totalBalance * 0.1 && totalBalance > 0) {
    suggestions.push({
      type: 'tip',
      icon: '💡',
      title: 'Consider building an emergency fund',
      description: `Your monthly expenses are significant compared to your total balance`,
    });
  }

  // No spending this month
  if (monthlyTransactions.length === 0) {
    suggestions.push({
      type: 'tip',
      icon: '📊',
      title: 'No transactions yet this month',
      description: 'Start tracking your spending to get personalized insights',
    });
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800';
      case 'insight':
        return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800';
      case 'tip':
        return 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800';
      default:
        return '';
    }
  };

  const getSuggestionTextColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-900 dark:text-amber-200';
      case 'insight':
        return 'text-blue-900 dark:text-blue-200';
      case 'tip':
        return 'text-emerald-900 dark:text-emerald-200';
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Suggestions"
        subtitle="Personalized financial insights"
      />

      <div className="px-6 space-y-5">
        {suggestions.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="You're doing great!"
            description="No immediate suggestions. Keep tracking your spending!"
          />
        ) : (
          <Section>
            {suggestions.map((suggestion, idx) => (
              <Card
                key={idx}
                className={`p-5 bg-gradient-to-br ${getSuggestionColor(suggestion.type)} border`}
              >
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">{suggestion.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-bold ${getSuggestionTextColor(suggestion.type)}`}>
                      {suggestion.title}
                    </h3>
                    <p className={`text-sm mt-1 ${getSuggestionTextColor(suggestion.type)} opacity-90`}>
                      {suggestion.description}
                    </p>
                    {suggestion.action && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-3"
                      >
                        {suggestion.action}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </Section>
        )}

        {/* Spending Summary */}
        {categorySpending.length > 0 && (
          <Section title="Spending This Month">
            {categorySpending.map((item) => (
              <Card key={item.category.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.category.emoji}</span>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {item.category.name}
                    </h4>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.spent)}
                  </p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      item.percentage > 100
                        ? 'bg-rose-500'
                        : item.percentage >= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </Card>
            ))}
          </Section>
        )}

        {/* Account Health */}
        <Section title="Account Health">
          {accounts.map((account) => {
            const healthStatus =
              account.balance < 0
                ? { icon: '⚠️', text: 'Negative balance', color: 'text-rose-600 dark:text-rose-400' }
                : account.balance < totalMonthlyExpense
                  ? {
                      icon: '🔔',
                      text: 'Low balance',
                      color: 'text-amber-600 dark:text-amber-400',
                    }
                  : { icon: '✅', text: 'Healthy', color: 'text-emerald-600 dark:text-emerald-400' };

            return (
              <Card key={account.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{account.name}</h4>
                    <p className={`text-sm ${healthStatus.color}`}>
                      {healthStatus.icon} {healthStatus.text}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </Card>
            );
          })}
        </Section>
      </div>
    </div>
  );
}
