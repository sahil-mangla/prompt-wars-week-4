/** @jest-environment node */
const httpMocks = require('node-mocks-http');
const { POST } = require('../../app/api/translate/route.js');

describe('/api/translate - Functional & Multilingual Support', () => {
  let originalEnv;
  beforeEach(() => {
    // Save original env
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it('returns mock translation when GEMINI_API_KEY is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const request = new Request('http://localhost:3000/api/translate', {
      method: 'POST',
      body: JSON.stringify({
        text: 'Proceed to Gate 7B immediately.',
        targetLang: 'es',
        context: 'Stadium operations'
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mock).toBe(true);
    expect(data.translatedText).toBe('Proceed to Gate 7B immediately.');
  });
});
