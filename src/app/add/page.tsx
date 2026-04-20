'use client';

import { useFinance } from '@/lib/finance-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardBody, Section } from '@/components/cards';
import { Button, Input, Select } from '@/components/ui/index';
import { useForm } from '@/hooks';

interface AddTransactionForm {
  type: 'expense' | 'income' | 'transfer';
  amount: string;
  categoryId: string;
  subCategoryId: string;
  accountId: string;
  toAccountId: string;
  description: string;
  date: string;
}

export default function AddTransaction() {
  const router = useRouter();
  const { categories, accounts, templates, addTransaction: addTx } = useFinance();
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm<AddTransactionForm>({
    initialValues: {
      type: 'expense',
      amount: '',
      categoryId: categories.filter((c) => c.type === 'expense')[0]?.id || '',
      subCategoryId: '',
      accountId: accounts[0]?.id || '',
      toAccountId: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
    validate: (values) => {
      const newErrors: Record<string, string> = {};
      if (!values.amount || parseFloat(values.amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
      if (values.type !== 'transfer' && !values.categoryId) {
        newErrors.categoryId = 'Category is required';
      }
      if (!values.accountId) {
        newErrors.accountId = 'Account is required';
      }
      if (values.type === 'transfer' && !values.toAccountId) {
        newErrors.toAccountId = 'Transfer to account is required';
      }
      return newErrors;
    },
    onSubmit: (formValues) => {
      addTx({
        accountId: formValues.accountId,
        categoryId: formValues.categoryId,
        type: formValues.type,
        amount: parseFloat(formValues.amount),
        description: formValues.description,
        date: formValues.date,
        toAccountId: formValues.type === 'transfer' ? formValues.toAccountId : undefined,
        subCategoryId: formValues.subCategoryId || undefined,
      });
      router.push('/');
    },
  });

  const typeCategories = categories.filter((c) => c.type === type);
  const expenseTemplates = templates.filter((t) => t.type === 'expense');
  const incomeTemplates = templates.filter((t) => t.type === 'income');

  const handleTemplateClick = (template: (typeof templates)[0]) => {
    setType(template.type);
    setFieldValue('type', template.type);
    setFieldValue('amount', template.amount.toString());
    setFieldValue('categoryId', template.categoryId);
    setFieldValue('accountId', template.accountId);
    setFieldValue('description', template.description || '');
  };

  const getCategoryEmoji = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.emoji || '📝';
  };

  return (
    <div className="w-full">
      <PageHeader title="Add Transaction" subtitle="Record a new transaction" />

      <div className="px-6 space-y-5">
        {/* Quick Templates */}
        {(type === 'expense' ? expenseTemplates : incomeTemplates).length > 0 && (
          <Section title="💨 Quick Add (1 tap)">
            <div className="grid grid-cols-4 gap-2">
              {(type === 'expense' ? expenseTemplates : incomeTemplates).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition text-center"
                >
                  <div className="text-2xl mb-1">{getCategoryEmoji(template.categoryId)}</div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white break-words">
                    {template.name}
                  </p>
                </button>
              ))}
            </div>
          </Section>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['expense', 'income', 'transfer'] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={values.type === t ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => {
                    setType(t);
                    setFieldValue('type', t);
                    setFieldValue('categoryId', '');
                  }}
                >
                  {t === 'expense' ? '💸 Spend' : t === 'income' ? '💵 Earn' : '↔️ Transfer'}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <Input
            label="Amount"
            type="number"
            step="1"
            name="amount"
            placeholder="0"
            value={values.amount}
            onChange={handleChange}
            error={errors.amount}
            icon="Rp"
          />

          {/* Category */}
          {values.type !== 'transfer' && (
            <Select
              label="Category"
              name="categoryId"
              value={values.categoryId}
              onChange={handleChange}
              error={errors.categoryId}
              options={typeCategories.map((cat) => ({
                value: cat.id,
                label: `${cat.emoji} ${cat.name}`,
              }))}
              placeholder="Select a category"
            />
          )}

          {/* Sub-Category */}
          {values.type !== 'transfer' && values.categoryId && (
            (() => {
              const selectedCategory = categories.find((c) => c.id === values.categoryId);
              const hasSubCategories = selectedCategory?.subCategories && selectedCategory.subCategories.length > 0;
              return hasSubCategories ? (
                <Select
                  label="Sub-Category (Optional)"
                  name="subCategoryId"
                  value={values.subCategoryId}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'None' },
                    ...(selectedCategory?.subCategories || []).map((sub) => ({
                      value: sub.id,
                      label: `${sub.emoji || ''} ${sub.name}`.trim(),
                    })),
                  ]}
                  placeholder="Select a sub-category"
                />
              ) : null;
            })()
          )}

          {/* Account */}
          <Select
            label="Account"
            name="accountId"
            value={values.accountId}
            onChange={handleChange}
            error={errors.accountId}
            options={accounts.map((acc) => ({
              value: acc.id,
              label: acc.name,
            }))}
            placeholder="Select an account"
          />

          {/* Transfer To Account */}
          {values.type === 'transfer' && (
            <Select
              label="Transfer To"
              name="toAccountId"
              value={values.toAccountId}
              onChange={handleChange}
              error={errors.toAccountId}
              options={accounts
                .filter((a) => a.id !== values.accountId)
                .map((acc) => ({
                  value: acc.id,
                  label: acc.name,
                }))}
              placeholder="Select destination"
            />
          )}

          {/* Description */}
          <Input
            label="Description (Optional)"
            type="text"
            name="description"
            placeholder="Add notes..."
            value={values.description}
            onChange={handleChange}
          />

          {/* Date */}
          <Input
            label="Date"
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              size="lg"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth size="lg">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
