import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputDisplayState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'filled'
  | 'error'
  | 'success'
  | 'disabled'
  | 'read-only'
  | 'loading';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  size?: InputSize;
  state?: InputDisplayState;
  containerClassName?: string;
}

const sizeClasses: Record<InputSize, { container: string; input: string; text: string }> = {
  sm: { container: 'h-8', input: 'px-2.5 text-xs', text: 'text-xs' },
  md: { container: 'h-9', input: 'px-3 text-sm', text: 'text-xs' },
  lg: { container: 'h-11', input: 'px-4 text-base', text: 'text-sm' },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    label,
    helperText,
    errorText,
    successText,
    prefixIcon,
    suffixIcon,
    clearable,
    onClear,
    size = 'md',
    state,
    disabled = false,
    readOnly = false,
    required = false,
    value,
    id,
    ...props
  },
  ref,
) {
  const inputId = (id ?? label) ? label?.toLowerCase().replace(/\s+/g, '-') : undefined;
  const isFilled = Boolean(value && String(value).length > 0);
  const isLoading = state === 'loading';
  const isError = Boolean(errorText) || state === 'error';
  const isSuccess = Boolean(successText) || state === 'success';
  const isDisabled = disabled || state === 'disabled';
  const isReadOnly = readOnly || state === 'read-only';
  const currentSize = sizeClasses[size];

  // Simulated visual states for showcase demo
  const stateClasses = cn(
    state === 'hover' && 'border-primary ring-1 ring-primary/30',
    state === 'focus' && 'ring-2 ring-ring border-primary',
    isError && 'border-danger focus-within:ring-danger text-danger',
    isSuccess && 'border-success focus-within:ring-success',
  );

  return (
    <div className={cn('w-full flex flex-col gap-1', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('font-medium text-foreground flex items-center gap-1', currentSize.text)}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div
        className={cn(
          'relative flex items-center w-full rounded-md border border-border bg-surface text-foreground transition-all shadow-soft overflow-hidden',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          isDisabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
          isReadOnly && 'bg-muted-surface/50 cursor-default',
          currentSize.container,
          stateClasses,
        )}
      >
        {prefixIcon && (
          <div className="ps-2.5 text-muted shrink-0 flex items-center justify-center">
            {prefixIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          value={value}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={required}
          className={cn(
            'w-full h-full bg-transparent text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed',
            currentSize.input,
            prefixIcon && 'ps-2',
            (suffixIcon || clearable || isLoading || isError || isSuccess) && 'pe-2',
            className,
          )}
          {...props}
        />

        {clearable && isFilled && !isDisabled && !isReadOnly && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 me-1 text-muted hover:text-foreground rounded transition-colors"
            tabIndex={-1}
            aria-label="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {isLoading && (
          <div className="pe-2.5 text-primary shrink-0 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {!isLoading && isError && (
          <div className="pe-2.5 text-danger shrink-0 flex items-center">
            <AlertCircle className="h-4 w-4" />
          </div>
        )}

        {!isLoading && !isError && isSuccess && (
          <div className="pe-2.5 text-success shrink-0 flex items-center">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}

        {!isLoading && !isError && !isSuccess && suffixIcon && (
          <div className="pe-2.5 text-muted shrink-0 flex items-center">{suffixIcon}</div>
        )}
      </div>

      {errorText ? (
        <p className="text-[11px] text-danger">{errorText}</p>
      ) : successText ? (
        <p className="text-[11px] text-success">{successText}</p>
      ) : helperText ? (
        <p className="text-[11px] text-muted">{helperText}</p>
      ) : null}
    </div>
  );
});
