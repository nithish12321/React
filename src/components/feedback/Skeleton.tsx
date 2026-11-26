import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  circle?: boolean;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, circle = false, width, height }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse bg-muted-surface border border-border/40',
        circle ? 'rounded-full' : 'rounded-md',
        className,
      )}
      style={{ width, height }}
    />
  );
}
