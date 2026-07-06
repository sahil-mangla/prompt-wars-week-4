/**
 * @jest-environment node
 */

import { POST, GET } from "../../app/api/analyze/route.js";

// Mock the global fetch
global.fetch = jest.fn();

describe("Analyze API Endpoint Security & Logic", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("GET request should return 405 Method Not Allowed", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(405);
    expect(data.error).toBe("Method not allowed");
  });

  test("Missing telemetry returns 400 Bad Request", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        zone: "Gate 7",
        type: "Congestion"
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/telemetry/);
  });

  test("Missing zone or type returns 400 Bad Request", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        telemetry: { flowSlowdown: 14 }
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/zone/);
  });

  test("Missing GEMINI_API_KEY uses fallback and interpolates numbers", async () => {
    delete process.env.GEMINI_API_KEY;

    const req = {
      json: jest.fn().mockResolvedValue({
        telemetry: {
          flowSlowdown: 14,
          scanRateSurge: 28,
          heatIndex: 38,
          historicalIncidentMatch: true
        },
        zone: "Gate 7",
        type: "Congestion"
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mock).toBe(true);
    expect(data.explanation).toContain("14%");
    expect(data.explanation).toContain("28%");
    expect(data.explanation).toContain("Gate 7");
    expect(data.ecoImpact).toContain("Gate 7");
  });

  test("Valid API Key calls Gemini and returns JSON", async () => {
    process.env.GEMINI_API_KEY = "test_key";
    process.env.GEMINI_MODEL = "gemini-test";

    const mockAiResponse = {
      explanation: "Gemini explanation 14% 28%.",
      proposedActions: ["Action 1", "Action 2"],
      ecoImpact: "Eco impact info."
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockAiResponse) }]
            }
          }
        ]
      })
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        telemetry: {
          flowSlowdown: 14,
          scanRateSurge: 28,
          heatIndex: 38,
          historicalIncidentMatch: true
        },
        zone: "Gate 7",
        type: "Congestion"
      }),
    };

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.explanation).toBe("Gemini explanation 14% 28%.");
    expect(data.proposedActions).toHaveLength(2);
    expect(data.ecoImpact).toBe("Eco impact info.");
    
    // Check if fetch was called with right args
    const fetchCall = global.fetch.mock.calls[0];
    expect(fetchCall[0]).toContain("test_key");
    expect(fetchCall[0]).toContain("gemini-test");
    
    const fetchBody = JSON.parse(fetchCall[1].body);
    expect(fetchBody.generationConfig.responseMimeType).toBe("application/json");
  });
});
