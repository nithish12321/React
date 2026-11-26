import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { InputDisplayState, InputSize } from './Input';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  showCount?: boolean;
  size?: InputSize;
  state?: InputDisplayState;
  containerClassName?: string;
}

const sizeClasses: Record<InputSize, { textarea: string; text: string }> = {
  sm: { textarea: 'p-2 text-xs', text: 'text-xs' },
  md: { textarea: 'p-3 text-sm', text: 'text-xs' },
  lg: { textarea: 'p-4 text-base', text: 'text-sm' },
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    containerClassName,
    label,
    helperText,
    errorText,
    successText,
    showCount = false,
    maxLength,
    size = 'md',
    state,
    disabled = false,
    readOnly = false,
    required = false,
    value,
    id,
    rows = 3,
    ...props
  },
  ref,
) {
  const textareaId = (id ?? label) ? label?.toLowerCase().replace(/\s+/g, '-') : undefined;
  const currentLength = typeof value === 'string' ? value.length : 0;
  const isError = Boolean(errorText) || state === 'error';
  const isSuccess = Boolean(successText) || state === 'success';
  const isDisabled = disabled || state === 'disabled';
  const isReadOnly = readOnly || state === 'read-only';
  const currentSize = sizeClasses[size];

  return (
    <div className={cn('w-full flex flex-col gap-1', containerClassName)}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn('font-medium text-foreground flex items-center gap-1', currentSize.text)}
          >
            {label}
            {required && <span className="text-danger">*</span>}
          </label>
        )}
        {showCount && maxLength && (
          <span className="text-[11px] text-muted font-mono">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      <div
        className={cn(
          'relative w-full rounded-md border border-border bg-surface text-foreground transition-all shadow-soft overflow-hidden',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          isDisabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
          isReadOnly && 'bg-muted-surface/50 cursor-default',
          isError && 'border-danger focus-within:ring-danger text-danger',
          isSuccess && 'border-success focus-within:ring-success',
          state === 'hover' && 'border-primary ring-1 ring-primary/30',
          state === 'focus' && 'ring-2 ring-ring border-primary',
        )}
      >
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          value={value}
          maxLength={maxLength}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={required}
          className={cn(
            'w-full bg-transparent text-foreground placeholder:text-muted focus:outline-none resize-y disabled:cursor-not-allowed',
            currentSize.textarea,
            className,
          )}
          {...props}
        />
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
