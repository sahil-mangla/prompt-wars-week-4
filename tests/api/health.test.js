/** @jest-environment node */
import { GET } from '../../app/api/health/route';

describe('Health Check API (/api/health)', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original env
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  test('returns 200 OK and valid health schema', async () => {
    process.env.GEMINI_API_KEY = 'mock-key';
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'mock-fb-key';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'mock-project';

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.version).toBe('1.0.0');
    expect(data.services.gemini_api_configured).toBe(true);
    expect(data.services.firebase_configured).toBe(true);
    expect(data.services.sync_mode).toBe('firestore');
  });

  test('reports correct sync mode and config status when firebase keys are missing', async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const response = await GET();
    const data = await response.json();

    expect(data.services.firebase_configured).toBe(false);
    expect(data.services.sync_mode).toBe('local_broadcast_channel');
  });

  test('reports gemini_api_configured as false if GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    const response = await GET();
    const data = await response.json();

    expect(data.services.gemini_api_configured).toBe(false);
  });

  test('does not expose actual environment variables in response', async () => {
    process.env.GEMINI_API_KEY = 'SUPER_SECRET_KEY';
    
    const response = await GET();
    const data = await response.json();
    
    const responseStr = JSON.stringify(data);
    expect(responseStr).not.toContain('SUPER_SECRET_KEY');
  });
});
