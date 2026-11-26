import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type ResultType = '404' | '500' | 'success';

export interface ResultPageProps {
  type?: ResultType;
  title?: string;
  description?: string;
  onPrimaryClick?: () => void;
  className?: string;
}

const templates = {
  '404': {
    code: '404',
    title: 'Page Not Found',
    desc: 'The page you are looking for does not exist or has been moved.',
    icon: HelpCircle,
    color: 'text-muted',
    btn: 'Back to Home',
  },
  '500': {
    code: '500',
    title: 'Server Error',
    desc: 'Something went wrong on our servers. We are looking into it.',
    icon: AlertCircle,
    color: 'text-danger',
    btn: 'Retry Request',
  },
  success: {
    code: '200',
    title: 'Action Completed',
    desc: 'Your request was processed and recorded successfully.',
    icon: CheckCircle2,
    color: 'text-success',
    btn: 'Continue',
  },
};

export function ResultPage({
  type = '404',
  title,
  description,
  onPrimaryClick,
  className,
}: ResultPageProps) {
  const current = templates[type];
  const Icon = current.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 text-center shadow-soft',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full bg-muted-surface border border-border mb-3',
          current.color,
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <span className="font-mono text-2xl font-extrabold text-foreground">{current.code}</span>
      <h3 className="mt-1 text-base font-bold text-foreground">{title ?? current.title}</h3>
      <p className="mt-1.5 text-xs text-muted max-w-sm leading-relaxed">
        {description ?? current.desc}
      </p>

      <div className="mt-5">
        <Button size="sm" onClick={onPrimaryClick}>
          {current.btn}
        </Button>
      </div>
    </div>
  );
}
