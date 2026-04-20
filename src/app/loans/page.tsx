'use client';

import { useFinance } from '@/lib/finance-context';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';
import { PageHeader, List } from '@/components/common';
import { Card, CardBody, ProgressBar, Section, EmptyState } from '@/components/cards';
import { Button } from '@/components/ui/index';
import { LoanItem } from '@/components/domain';

export default function Loans() {
  const { loans, installments, accounts, updateInstallmentStatus } = useFinance();
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);

  const getLoanInstallments = (loanId: string) => {
    return installments.filter((i) => i.loanId === loanId).sort((a, b) => a.installmentNumber - b.installmentNumber);
  };

  const getPendingInstallments = (loanId: string) => {
    return getLoanInstallments(loanId).filter((i) => i.status === 'pending');
  };

  const getAccountName = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.name || 'Unknown';
  };

  const calculateMonthlyPayment = (principal: number, interestRate: number, tenure: number) => {
    const monthlyRate = interestRate / 100 / 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  };

  return (
    <div className="w-full">
      <PageHeader title="Loans" subtitle="Track your obligations" />

      <div className="px-6 space-y-5">
        {loans.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No loans yet"
            description="Track your loans and installments here"
          />
        ) : (
          <List
            items={loans.map((loan) => {
              const loanInstallments = getLoanInstallments(loan.id);
              const paidInstallments = loanInstallments.filter((i) => i.status === 'paid').length;
              const nextInstallment = getPendingInstallments(loan.id)[0];
              const monthlyPayment = calculateMonthlyPayment(loan.principal, loan.interestRate, loan.tenure);

              return (
                <LoanItem
                  key={loan.id}
                  name={loan.name}
                  principal={loan.principal}
                  remainingBalance={loan.remainingBalance}
                  interestRate={loan.interestRate}
                  accountName={getAccountName(loan.accountId)}
                  paidInstallments={paidInstallments}
                  totalInstallments={loanInstallments.length}
                  isExpanded={expandedLoanId === loan.id}
                  onToggle={() =>
                    setExpandedLoanId(expandedLoanId === loan.id ? null : loan.id)
                  }
                >
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Progress
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {paidInstallments} / {loanInstallments.length}
                      </p>
                    </div>
                    <ProgressBar value={paidInstallments} max={loanInstallments.length} variant="success" showLabel={false} />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <Card>
                      <CardBody>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">Monthly Payment</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(monthlyPayment)}
                        </p>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">Tenure</p>
                        <p className="font-bold text-slate-900 dark:text-white">{loan.tenure} months</p>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Next Installment */}
                  {nextInstallment && (
                    <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-200 dark:border-amber-800 mb-4">
                      <p className="text-xs text-amber-900 dark:text-amber-200 font-bold mb-3 uppercase tracking-wider">
                        ⏰ Next Payment Due
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-amber-900 dark:text-amber-200">
                            {formatCurrency(nextInstallment.amount)}
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                            Due: {nextInstallment.dueDate}
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => updateInstallmentStatus(nextInstallment.id, 'paid')}
                        >
                          Mark Paid
                        </Button>
                      </div>
                    </Card>
                  )}

                  {/* Installment List */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                      Installment History
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {loanInstallments.map((inst) => (
                        <Card
                          key={inst.id}
                          className={`p-3 ${
                            inst.status === 'paid'
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                              : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-xs">
                                #{inst.installmentNumber}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  inst.status === 'paid'
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : 'text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {inst.status === 'paid' ? inst.paidDate : inst.dueDate}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900 dark:text-white text-xs">
                                {formatCurrency(inst.amount)}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  inst.status === 'paid'
                                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                    : 'text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {inst.status === 'paid' ? '✓ Paid' : 'Pending'}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </LoanItem>
              );
            })}
          />
        )}
      </div>
    </div>
  );
}
