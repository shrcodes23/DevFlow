'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="animate-fade-in">{action}</div>}
    </div>
  );
}

export function StatCard({
  label, value, delta, icon: Icon, accent = 'primary', footer,
}: {
  label: string; value: string | number; delta?: string;
  icon: React.ElementType; accent?: 'primary' | 'success' | 'warning' | 'info' | 'destructive';
  footer?: ReactNode;
}) {
  const accentMap: Record<string, string> = {
    primary: 'from-primary/20 to-primary/5 text-primary',
    success: 'from-success/20 to-success/5 text-success',
    warning: 'from-warning/20 to-warning/5 text-warning',
    info: 'from-info/20 to-info/5 text-info',
    destructive: 'from-destructive/20 to-destructive/5 text-destructive',
  };
  const deltaUp = delta?.startsWith('+');
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-border/80 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br', accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(delta || footer) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta && (
            <span className={cn('font-medium', deltaUp ? 'text-success' : 'text-destructive')}>{delta}</span>
          )}
          {footer && <span className="text-muted-foreground">{footer}</span>}
        </div>
      )}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} />;
}

export function ChartSkeleton() {
  return <div className="skeleton h-64 rounded-xl" />;
}

export function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-medium">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground max-w-sm">{description}</p>}
    </div>
  );
}
