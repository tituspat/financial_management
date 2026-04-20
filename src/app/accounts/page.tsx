'use client';

import { useFinance } from '@/lib/finance-context';
import { useState } from 'react';
import { PageHeader, List, Grid } from '@/components/common';
import { Card, CardBody, Section, EmptyState } from '@/components/cards';
import { Button, Input, Select } from '@/components/ui/index';
import { AccountItem } from '@/components/domain';
import { useForm } from '@/hooks';

interface AddAccountForm {
  name: string;
  type: 'checking' | 'savings' | 'credit_card';
  balance: string;
  currency: string;
}

export default function Accounts() {
  const { accounts, addAccount: addAcc, archiveAccount } = useFinance();
  const [showForm, setShowForm] = useState(false);

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm<AddAccountForm>({
    initialValues: {
      name: '',
      type: 'checking',
      balance: '',
      currency: 'IDR',
    },
    validate: (values) => {
      const newErrors: Record<string, string> = {};
      if (!values.name) newErrors.name = 'Account name is required';
      if (!values.balance || parseFloat(values.balance) < 0) {
        newErrors.balance = 'Balance must be valid';
      }
      return newErrors;
    },
    onSubmit: (formValues) => {
      addAcc({
        name: formValues.name,
        type: formValues.type,
        balance: parseFloat(formValues.balance),
        currency: formValues.currency,
        archived: false,
      });
      resetForm();
      setShowForm(false);
    },
  });

  const activeAccounts = accounts.filter((a) => !a.archived);
  const archivedAccounts = accounts.filter((a) => a.archived);

  const getAccountTransactions = (accountId: string) => {
    // This would be connected to actual transactions count
    return 0;
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Accounts"
        subtitle="Manage your finances"
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
        {/* Add Account Form */}
        {showForm && (
          <Card>
            <CardBody className="space-y-3">
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  label="Account Name"
                  name="name"
                  placeholder="e.g., Checking Account"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Select
                  label="Type"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  options={[
                    { value: 'checking', label: '🏦 Checking' },
                    { value: 'savings', label: '🏧 Savings' },
                    { value: 'credit_card', label: '💳 Credit Card' },
                  ]}
                />
                <Input
                  label="Starting Balance"
                  type="number"
                  step="1"
                  name="balance"
                  placeholder="0"
                  value={values.balance}
                  onChange={handleChange}
                  error={errors.balance}
                />
                <Button type="submit" variant="primary" fullWidth>
                  Create Account
                </Button>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Active Accounts */}
        <Section title="Active Accounts">
          {activeAccounts.length === 0 ? (
            <EmptyState
              icon="💳"
              title="No accounts yet"
              action={
                <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                  Create Account
                </Button>
              }
            />
          ) : (
            <List
              items={activeAccounts.map((account) => (
                <AccountItem
                  key={account.id}
                  name={account.name}
                  type={account.type}
                  balance={account.balance}
                  transactionCount={getAccountTransactions(account.id)}
                  onArchive={() => archiveAccount(account.id)}
                />
              ))}
            />
          )}
        </Section>

        {/* Archived Accounts */}
        {archivedAccounts.length > 0 && (
          <Section title={`Archived (${archivedAccounts.length})`}>
            <List
              items={archivedAccounts.map((account) => (
                <Card key={account.id} className="p-4 opacity-60">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                        {account.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Archived</p>
                    </div>
                  </div>
                </Card>
              ))}
            />
          </Section>
        )}
      </div>
    </div>
  );
}
