import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cn(
        'flex gap-2',
        isVertical ? 'flex-col space-y-4' : 'items-center justify-between',
        className,
      )}
    >
      {steps.map((step, idx) => {
        const isDone = idx < activeStep;
        const isCurrent = idx === activeStep;

        return (
          <div key={step.id} className={cn('flex items-center gap-3', !isVertical && 'flex-1')}>
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all shadow-soft',
                isDone && 'bg-primary text-primary-fg',
                isCurrent && 'bg-primary/20 text-primary border-2 border-primary',
                !isDone && !isCurrent && 'border border-border bg-muted-surface text-muted',
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : idx + 1}
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  'text-xs font-semibold truncate',
                  isCurrent ? 'text-foreground' : 'text-muted',
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="text-[10px] text-muted truncate">{step.description}</p>
              )}
            </div>

            {!isVertical && idx < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 mx-3 rounded',
                  idx < activeStep ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
