import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

export interface MultiStepWizardProps {
  steps: WizardStep[];
  onComplete?: () => void;
  className?: string;
}

export function MultiStepWizard({ steps, onComplete, className }: MultiStepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    plan: 'Pro Plan ($29/mo)',
    notifications: true,
  });

  const isLast = currentStep === steps.length - 1;

  const nextStep = () => {
    if (isLast) {
      onComplete?.();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={cn('rounded-xl border border-border bg-surface p-5 shadow-soft', className)}>
      {/* Steps Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        {steps.map((st, i) => {
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={st.id} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all',
                  isDone && 'bg-primary text-primary-fg',
                  isCurrent && 'bg-primary/20 text-primary border border-primary',
                  !isDone && !isCurrent && 'bg-muted-surface text-muted border border-border',
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <div className="hidden sm:block min-w-0">
                <p
                  className={cn(
                    'text-xs font-semibold truncate',
                    isCurrent ? 'text-foreground' : 'text-muted',
                  )}
                >
                  {st.title}
                </p>
              </div>
              {i < steps.length - 1 && <div className="h-px flex-1 bg-border mx-2" />}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="py-6 min-h-[140px]">
        {currentStep === 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Step 1: Account Profile</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Step 2: Choose Plan</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Starter ($9/mo)', 'Pro Plan ($29/mo)'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, plan: p })}
                  className={cn(
                    'rounded-lg border p-3 text-start text-xs font-medium transition-all',
                    formData.plan === p
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-surface text-foreground hover:bg-muted-surface',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Step 3: Review & Submit</h4>
            <div className="rounded-md bg-muted-surface/50 p-3 text-xs space-y-1.5 border border-border font-mono">
              <p>Name: {formData.name}</p>
              <p>Email: {formData.email}</p>
              <p>Plan: {formData.plan}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentStep === 0}
          onClick={prevStep}
          prefixIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={nextStep}
          suffixIcon={!isLast ? <ChevronRight className="h-4 w-4" /> : undefined}
        >
          {isLast ? 'Complete Registration' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
}
