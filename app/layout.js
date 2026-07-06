import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

// Use next/font for zero-FOIT font loading (no render-blocking @import in CSS)
const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap", // Swap ensures text is visible during font load
  variable: "--font-atkinson",
});

export const metadata = {
  title: "MatchMind — FIFA World Cup 2026 Operations",
  description:
    "GenAI-Powered Stadium Operations Intelligence & Decision Support for FIFA World Cup 2026. Real-time crowd management, multilingual volunteer dispatch, and accessible fan navigation.",
  keywords: [
    "FIFA World Cup 2026",
    "stadium operations",
    "crowd management",
    "GenAI",
    "accessibility",
    "multilingual",
  ],
  openGraph: {
    title: "MatchMind — FIFA World Cup 2026 Operations",
    description:
      "SentinelAI-powered crowd prediction and multilingual operations dispatch for the 2026 World Cup.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // themeColor for mobile browser chrome — matches MatchMind brand blue
  themeColor: "#1a3a8a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={atkinson.variable}>
      <body>{children}</body>
    </html>
  );
}
