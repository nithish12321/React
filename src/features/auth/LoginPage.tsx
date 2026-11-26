import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, Mail, LogIn, Fingerprint } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { credentialsReceived, type LoginRequest } from './authSlice';
import { pushToast } from '@/features/ui/uiSlice';
import { loginSchema, type LoginFormData } from './loginSchema';
import { Panel } from './Panel';

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((s) => s.auth.status);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (status === 'authenticated') navigate('/app');
  }, [status, navigate]);

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password } satisfies LoginRequest),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      dispatch(pushToast({ title: body.message ?? 'Sign in failed', variant: 'error' }));
      return;
    }
    const data2 = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      email: string;
    };
    dispatch(
      credentialsReceived({
        accessToken: data2.accessToken,
        refreshToken: data2.refreshToken,
        expiresAt: Date.now() + data2.expiresIn * 1000,
        email: data2.email,
        rememberMe: data.rememberMe,
      }),
    );
    navigate('/app');
  };

  const busy = isSubmitting || status === 'authenticating';
  const fieldError = (key: 'email' | 'password') =>
    errors[key] ? <p className="text-xs text-danger mt-1">{errors[key]?.message}</p> : null;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Panel />
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold">{t('login.heading')}</h1>
          <p className="mt-1 text-sm text-muted">{t('login.subheading')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                {t('login.email')}
              </label>
              <div className="relative mt-1">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="w-full rounded-md border border-border bg-surface px-9 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="you@example.com"
                />
              </div>
              {fieldError('email')}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                {t('login.password')}
              </label>
              <div className="relative mt-1">
                <Lock
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full rounded-md border border-border bg-surface px-9 py-2 pr-10 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-muted-surface"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
              {fieldError('password')}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  checked={rememberMe}
                  onChange={(e) => setValue('rememberMe', e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-[var(--color-primary)]"
                />
                {t('login.remember')}
              </label>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    pushToast({
                      title: t('toast.uiOnly'),
                      description: t('toast.forgotBody'),
                      variant: 'warning',
                    }),
                  )
                }
                className="text-sm text-primary hover:underline"
              >
                {t('login.forgot')}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden
                />
              ) : (
                <LogIn className="h-4 w-4" aria-hidden />
              )}
              {busy ? t('login.signingIn') : t('login.signIn')}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">{t('login.orContinue')}</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(['google', 'github'] as const).map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() =>
                  dispatch(
                    pushToast({
                      title: t('toast.uiOnly'),
                      description: t('toast.socialBody', { provider: t(`login.${provider}`) }),
                      variant: 'warning',
                    }),
                  )
                }
                className="flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm hover:bg-muted-surface"
              >
                <Fingerprint className="h-4 w-4" aria-hidden />
                {t(`login.${provider}`)}
              </button>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted">{t('login.demoHint')}</p>
        </div>
      </div>
    </div>
  );
}
