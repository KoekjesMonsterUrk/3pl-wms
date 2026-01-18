'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        pending:
          'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'in-progress':
          'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        completed:
          'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400',
        cancelled:
          'border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-400',
        error:
          'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Status Badge component for order/task statuses
interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusVariantMap: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
  draft: 'secondary',
  pending: 'pending',
  confirmed: 'pending',
  scheduled: 'pending',
  receiving: 'in-progress',
  quality_check: 'in-progress',
  received: 'completed',
  putaway: 'in-progress',
  putaway_pending: 'pending',
  allocated: 'pending',
  picking: 'in-progress',
  picked: 'in-progress',
  packing: 'in-progress',
  packed: 'in-progress',
  shipped: 'completed',
  delivered: 'completed',
  in_progress: 'in-progress',
  completed: 'completed',
  cancelled: 'cancelled',
  error: 'error',
  available: 'completed',
  reserved: 'pending',
  damaged: 'error',
  quarantine: 'warning',
  expired: 'error',
  sent: 'in-progress',
  paid: 'completed',
  overdue: 'error',
  low: 'secondary',
  normal: 'default',
  high: 'warning',
  urgent: 'error',
  assigned: 'in-progress',
  released: 'in-progress',
};

const statusLabelMap: Record<string, string> = {
  draft: 'Concept',
  pending: 'In afwachting',
  confirmed: 'Bevestigd',
  scheduled: 'Gepland',
  receiving: 'In ontvangst',
  quality_check: 'Kwaliteitscontrole',
  received: 'Ontvangen',
  putaway: 'Wegzetten',
  putaway_pending: 'Opslag wachtend',
  allocated: 'Toegewezen',
  picking: 'Picken',
  picked: 'Gepickt',
  packing: 'Inpakken',
  packed: 'Ingepakt',
  shipped: 'Verzonden',
  delivered: 'Afgeleverd',
  in_progress: 'In uitvoering',
  completed: 'Voltooid',
  cancelled: 'Geannuleerd',
  error: 'Fout',
  available: 'Beschikbaar',
  reserved: 'Gereserveerd',
  allocated_status: 'Gealloceerd',
  damaged: 'Beschadigd',
  quarantine: 'Quarantaine',
  expired: 'Verlopen',
  sent: 'Verstuurd',
  paid: 'Betaald',
  overdue: 'Achterstallig',
  low: 'Laag',
  normal: 'Normaal',
  high: 'Hoog',
  urgent: 'Urgent',
  assigned: 'Toegewezen',
  released: 'Vrijgegeven',
};

function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status] || 'default';
  const label = statusLabelMap[status] || status;

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: 'low' | 'normal' | 'high' | 'urgent';
  className?: string;
}

function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const variant = statusVariantMap[priority] || 'default';
  const label = statusLabelMap[priority] || priority;

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

export { Badge, badgeVariants, StatusBadge, PriorityBadge };
