'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur ${hover ? 'hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, children }: CardHeaderProps) {
  return (
    <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
      <div>
        {title && <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`p-5 border-t border-slate-200 dark:border-slate-700 flex gap-3 ${className}`}>
      {children}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max,
  variant = 'success',
  showLabel = true,
  animated = true,
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const variantClasses = {
    success: 'bg-gradient-to-r from-emerald-500 to-green-600',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
    danger: 'bg-gradient-to-r from-rose-500 to-rose-600',
  };

  return (
    <div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${variantClasses[variant]} ${animated ? 'transition-all duration-300' : ''} rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
          {Math.round(percentage)}% • {value} / {max}
        </p>
      )}
    </div>
  );
}

interface StatProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export function Stat({ label, value, icon, variant = 'default' }: StatProps) {
  const bgClass =
    variant === 'highlight'
      ? 'bg-indigo-100 dark:bg-indigo-900/30'
      : 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700';

  return (
    <div className={`p-4 rounded-xl ${bgClass}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-lg">{icon}</span>}
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="p-12 text-center">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{title}</p>
      {description && <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function Section({ title, subtitle, children, action }: SectionProps) {
  return (
    <div>
      {title && (
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
