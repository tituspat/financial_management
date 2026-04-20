'use client';

import React from 'react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showSettings?: boolean;
}

export function PageHeader({ title, subtitle, action, showSettings }: PageHeaderProps) {
  return (
    <div className="p-6 pt-8 flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {action}
        {showSettings && (
          <Link
            href="/settings"
            className="text-2xl p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            title="Settings"
          >
            ⚙️
          </Link>
        )}
      </div>
    </div>
  );
}

interface TabsProps {
  tabs: { id: string; label: string; icon?: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="px-6 pb-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              active === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:shadow-md'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ListProps {
  items: React.ReactNode[];
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
}

export function List({ items, className = '', spacing = 'md' }: ListProps) {
  const spacingClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  return <div className={`space-y-${spacingClasses[spacing].split('-')[1]} ${className}`}>{items}</div>;
}

interface GridProps {
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
}

export function Grid({ columns = 2, children, className = '', gap = 'md' }: GridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>{children}</div>
  );
}

interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return <div className={`border-t border-slate-200 dark:border-slate-700 ${className}`} />;
}

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin`}
      />
    </div>
  );
}

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  onClose?: () => void;
  action?: React.ReactNode;
}

export function Alert({ type, title, message, onClose, action }: AlertProps) {
  const typeClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    success:
      'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
    warning:
      'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    error: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200',
  };

  return (
    <div className={`p-4 border rounded-xl ${typeClasses[type]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-sm">{title}</p>
          {message && <p className="text-xs mt-1 opacity-90">{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-sm font-bold">
            ✕
          </button>
        )}
      </div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number;
  circle?: boolean;
}

export function Skeleton({ className = '', count = 1, circle = false }: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-slate-200 dark:bg-slate-700 animate-pulse ${circle ? 'rounded-full w-12 h-12' : 'rounded-lg h-4 w-full'} ${className}`}
        />
      ))}
    </div>
  );
}
