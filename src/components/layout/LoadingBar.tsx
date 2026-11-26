import { useEffect, useRef, useState } from 'react';
import { onLoadingChange } from '@/lib/interceptors';

/** Slim progress bar pinned to the top of the viewport, driven by interceptor activity. */
export function LoadingBar() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () =>
      onLoadingChange((isActive) => {
        setActive(isActive);
        if (isActive) {
          setVisible(true);
          if (timer.current) window.clearTimeout(timer.current);
        } else {
          timer.current = window.setTimeout(() => setVisible(false), 300);
        }
      }),
    [],
  );

  return (
    <div
      aria-hidden
      className={`fixed left-0 top-0 z-[60] h-0.5 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ width: active ? '80%' : '100%' }}
    >
      <div
        className={`h-full bg-primary transition-all ${active ? 'animate-pulse' : ''}`}
        style={{ boxShadow: 'var(--shadow-current)' }}
      />
    </div>
  );
}
