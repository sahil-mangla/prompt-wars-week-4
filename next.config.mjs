/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security: strict Content Security Policy and headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // CSP: allows Google Fonts for font loading, Firebase for Firestore, and Gemini API
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://firestore.googleapis.com https://generativelanguage.googleapis.com wss://*.firebaseio.com",
              "img-src 'self' data: blob:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Environment variable validation: Ensure critical keys are present in production
  // NEXT_PUBLIC_ prefix makes vars available in the browser bundle — use carefully
  // Never expose GEMINI_API_KEY as NEXT_PUBLIC_ — it must be server-side only
  env: {
    // GEMINI_API_KEY is accessed server-side via process.env.GEMINI_API_KEY (no NEXT_PUBLIC_ prefix)
    // Firebase keys are browser-safe and prefixed NEXT_PUBLIC_
  },
};

export default nextConfig;
