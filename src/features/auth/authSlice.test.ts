import { describe, it, expect } from 'vitest';
import authReducer, {
  credentialsReceived,
  tokenRefreshed,
  loggedOut,
  authenticating,
} from './authSlice';

describe('authSlice', () => {
  const initial = authReducer(undefined, { type: '@@INIT' });

  it('has initial unauthenticated state', () => {
    expect(initial.status).toBe('idle');
    expect(initial.accessToken).toBeNull();
    expect(initial.refreshToken).toBeNull();
  });

  it('handles authenticating', () => {
    const state = authReducer(initial, authenticating());
    expect(state.status).toBe('authenticating');
  });

  it('handles credentialsReceived', () => {
    const state = authReducer(
      initial,
      credentialsReceived({
        accessToken: 'at_123',
        refreshToken: 'rt_456',
        expiresAt: 123456789,
        email: 'admin@demo.com',
        rememberMe: true,
      }),
    );
    expect(state.status).toBe('authenticated');
    expect(state.accessToken).toBe('at_123');
    expect(state.refreshToken).toBe('rt_456');
    expect(state.email).toBe('admin@demo.com');
    expect(state.rememberMe).toBe(true);
  });

  it('handles tokenRefreshed', () => {
    const authed = authReducer(
      initial,
      credentialsReceived({
        accessToken: 'at_old',
        refreshToken: 'rt_123',
        expiresAt: 100,
        email: 'admin@demo.com',
        rememberMe: false,
      }),
    );
    const state = authReducer(authed, tokenRefreshed({ accessToken: 'at_new', expiresAt: 200 }));
    expect(state.accessToken).toBe('at_new');
    expect(state.expiresAt).toBe(200);
    expect(state.email).toBe('admin@demo.com');
  });

  it('handles loggedOut', () => {
    const authed = authReducer(
      initial,
      credentialsReceived({
        accessToken: 'at_123',
        refreshToken: 'rt_456',
        expiresAt: 123,
        email: 'admin@demo.com',
        rememberMe: true,
      }),
    );
    const state = authReducer(authed, loggedOut());
    expect(state.status).toBe('idle');
    expect(state.accessToken).toBeNull();
    expect(state.email).toBeNull();
    expect(state.justSignedOut).toBe(true);
  });
});
