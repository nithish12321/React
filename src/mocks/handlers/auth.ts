import { http, HttpResponse, delay } from 'msw';

const LATIN = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function fakeToken(prefix: string) {
  let out = '';
  for (let i = 0; i < 24; i++) out += LATIN[Math.floor(Math.random() * LATIN.length)];
  return `${prefix}_${out}`;
}

const DEMO_EMAIL = 'admin@demo.com';
const DEMO_PASSWORD = 'Admin@123';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email !== DEMO_EMAIL || body.password !== DEMO_PASSWORD) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    return HttpResponse.json({
      accessToken: fakeToken('at'),
      refreshToken: fakeToken('rt'),
      expiresIn: 60,
      email: body.email,
    });
  }),

  http.post('/api/auth/refresh', async () => {
    await delay(200);
    return HttpResponse.json({
      accessToken: fakeToken('at'),
      expiresIn: 60,
    });
  }),
];
