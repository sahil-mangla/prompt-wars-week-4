/** @jest-environment node */
const httpMocks = require('node-mocks-http');
const { POST, GET } = require('../../app/api/translate/route.js');

describe('/api/translate - Security & Validations', () => {
  let originalEnv;
  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('rejects GET requests (Method Not Allowed)', async () => {
    const request = new Request('http://localhost:3000/api/translate', { method: 'GET' });
    const response = await GET(request);
    expect(response.status).toBe(405);
  });

  it('rejects payloads missing text field', async () => {
    const request = new Request('http://localhost:3000/api/translate', {
      method: 'POST',
      body: JSON.stringify({ targetLang: 'es' }),
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('rejects unsupported target languages', async () => {
    const request = new Request('http://localhost:3000/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello', targetLang: 'unsupported_lang' }),
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('verifies NEXT_PUBLIC_GEMINI_API_KEY is undefined to ensure server-side exclusivity', () => {
    // This ensures no one accidentally added the public prefix to the real env var
    expect(process.env.NEXT_PUBLIC_GEMINI_API_KEY).toBeUndefined();
  });
});
