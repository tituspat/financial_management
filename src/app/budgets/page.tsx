'use client';

import { useFinance } from '@/lib/finance-context';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';
import { PageHeader, List, Grid } from '@/components/common';
import { Card, CardBody, Section, Stat, EmptyState } from '@/components/cards';
import { Button, Input, Select } from '@/components/ui/index';
import { BudgetItem } from '@/components/domain';
import { useForm } from '@/hooks';

interface AddBudgetForm {
  categoryId: string;
  limit: string;
}

export default function Budgets() {
  const { categories, budgets, addBudget: addBud } = useFinance();
  const [showForm, setShowForm] = useState(false);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7);
  const monthBudgets = budgets.filter((b) => b.month === currentMonth);
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm<AddBudgetForm>({
    initialValues: {
      categoryId: '',
      limit: '',
    },
    validate: (values) => {
      const newErrors: Record<string, string> = {};
      if (!values.categoryId) newErrors.categoryId = 'Category is required';
      if (!values.limit || parseFloat(values.limit) <= 0) {
        newErrors.limit = 'Limit must be greater than 0';
      }
      return newErrors;
    },
    onSubmit: (formValues) => {
      addBud({
        categoryId: formValues.categoryId,
        month: currentMonth,
        limit: parseFloat(formValues.limit),
        spent: 0,
      });
      resetForm();
      setShowForm(false);
    },
  });

  const getCategoryEmoji = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.emoji || '📝';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Other';
  };

  const totalBudget = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = monthBudgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="w-full">
      <PageHeader
        title="Budget"
        subtitle={monthName}
        action={
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕' : '+ Add'}
          </Button>
        }
      />

      <div className="px-6 space-y-5">
        {/* Add Budget Form */}
        {showForm && (
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Select
                  label="Category"
                  name="categoryId"
                  value={values.categoryId}
                  onChange={handleChange}
                  error={errors.categoryId}
                  options={expenseCategories
                    .filter((c) => !monthBudgets.find((b) => b.categoryId === c.id))
                    .map((cat) => ({
                      value: cat.id,
                      label: `${cat.emoji} ${cat.name}`,
                    }))}
                  placeholder="Select category"
                />
                <Input
                  label="Budget Limit"
                  type="number"
                  step="1"
                  name="limit"
                  placeholder="0"
                  value={values.limit}
                  onChange={handleChange}
                  error={errors.limit}
                  icon="Rp"
                />
                <Button type="submit" variant="primary" fullWidth>
                  Add Budget
                </Button>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Budget List */}
        {monthBudgets.length === 0 ? (
          <EmptyState
            icon="📊"
            title={`No budgets set for ${monthName}`}
            action={
              <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                Create your first budget
              </Button>
            }
          />
        ) : (
          <>
            <List
              items={monthBudgets.map((budget) => (
                <BudgetItem
                  key={budget.id}
                  categoryEmoji={getCategoryEmoji(budget.categoryId)}
                  categoryName={getCategoryName(budget.categoryId)}
                  spent={budget.spent}
                  limit={budget.limit}
                />
              ))}
            />

            {/* Summary Stats */}
            <Grid columns={2} gap="md">
              <Card>
                <CardBody className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-2 uppercase tracking-wider">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(totalBudget)}
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl">
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mb-2 uppercase tracking-wider">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                    {formatCurrency(totalSpent)}
                  </p>
                </CardBody>
              </Card>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
}
