'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/common';
import { Card, Section } from '@/components/cards';

export default function More() {
  const menuItems = [
    {
      title: 'Add Transaction',
      description: 'Record a new expense, income, or transfer',
      icon: '➕',
      href: '/add',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      title: 'Settings',
      description: 'Manage categories and customization',
      icon: '⚙️',
      href: '/settings',
      color: 'from-slate-600 to-slate-700',
    },
    {
      title: 'Loans',
      description: 'Track loans and installments',
      icon: '💳',
      href: '/loans',
      color: 'from-orange-600 to-red-600',
    },
    {
      title: 'Suggestions',
      description: 'Financial insights and recommendations',
      icon: '💡',
      href: '/suggestions',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="w-full">
      <PageHeader title="More" subtitle="Additional features and settings" />

      <div className="px-6 space-y-3 pb-8">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card hover className="p-4 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                </div>
                <span className="text-slate-400 dark:text-slate-500">›</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
