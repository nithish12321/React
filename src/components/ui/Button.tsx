import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-fg hover:opacity-90 shadow-soft',
  secondary: 'bg-secondary text-foreground hover:bg-secondary/80 shadow-soft',
  outline: 'border border-border bg-surface text-foreground hover:bg-muted-surface shadow-soft',
  ghost: 'text-foreground hover:bg-muted-surface',
  danger: 'bg-danger text-white hover:opacity-90 shadow-soft',
  link: 'text-primary hover:underline p-0 h-auto font-normal',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-md',
  lg: 'h-11 px-6 text-base gap-2.5 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'default',
    size = 'md',
    loading = false,
    disabled = false,
    prefixIcon,
    suffixIcon,
    children,
    ...props
  },
  ref,
) {
  const isLink = variant === 'link';
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
        variantStyles[variant],
        !isLink && sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
      ) : (
        prefixIcon && <span className="shrink-0">{prefixIcon}</span>
      )}
      {children}
      {!loading && suffixIcon && <span className="shrink-0">{suffixIcon}</span>}
    </button>
  );
});

export function ButtonGroup({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex rounded-md shadow-soft [&>button]:rounded-none [&>button:first-child]:rounded-s-md [&>button:last-child]:rounded-e-md [&>button:not(:last-child)]:border-e-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SplitButton({
  label,
  onClick,
  menuButton,
  variant = 'default',
  size = 'md',
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  menuButton: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}) {
  return (
    <ButtonGroup>
      <Button variant={variant} size={size} disabled={disabled} onClick={onClick}>
        {label}
      </Button>
      {menuButton}
    </ButtonGroup>
  );
}
