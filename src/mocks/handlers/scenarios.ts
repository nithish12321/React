import { http, HttpResponse, delay } from 'msw';

const wait = (ms: number) => delay(ms);
let force401Count = 0;

export const scenarioHandlers = [
  http.post('/api/scenario', async ({ request }) => {
    const body = (await request.json()) as { scenario?: string };
    const scenario = body.scenario ?? '';
    const started = Date.now();

    switch (scenario) {
      case 'success': {
        await wait(300);
        return HttpResponse.json({
          ok: true,
          scenario,
          latencyMs: Date.now() - started,
          message: 'Request completed successfully (200 OK)',
        });
      }
      case '401': {
        await wait(250);
        force401Count += 1;
        // On odd attempt: return 401 so interceptor triggers refresh
        // On even attempt (the retried request): return 200 OK with refreshed flag
        if (force401Count % 2 === 1) {
          return HttpResponse.json({ scenario, message: 'Token expired (401)' }, { status: 401 });
        }
        return HttpResponse.json({
          ok: true,
          scenario,
          latencyMs: Date.now() - started,
          message: 'Session refreshed — queued request retried and succeeded (200 OK)',
          retried: true,
          refreshed: true,
        });
      }
      case '500': {
        await wait(250);
        return HttpResponse.json(
          { scenario, message: 'Internal server error (mocked 500)' },
          { status: 500 },
        );
      }
      case 'slow': {
        await wait(2500);
        return HttpResponse.json({
          ok: true,
          scenario,
          latencyMs: Date.now() - started,
          message: 'Slow response finished after 2.5s',
        });
      }
      default:
        return HttpResponse.json({ message: 'Unknown scenario' }, { status: 400 });
    }
  }),
];
