import type { Metadata } from "next";
import { Shantell_Sans, Inter, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';
import { NotificationsProvider } from "@/contexts/notifications-context";
import { CalendarProvider } from "@/contexts/calendar-context";
import { ClearOldSidebarCache } from "@/components/utils/clear-old-sidebar-cache";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

// Optimize font loading with only necessary weights and subsets
const shantellSans = Shantell_Sans({
  variable: "--font-shantell-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload primary font
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true, // Primary font - preload for faster rendering
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'], // Only load needed weights
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Secondary font - load on demand
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'], // Only load needed weights
});

export const metadata: Metadata = {
  title: "Zoddy - Business Growth Tracker",
  description: "Track your business progress and growth in a data-driven manner. Perfect for small online businesses and shop owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${shantellSans.variable} ${inter.variable} ${dmSans.variable} antialiased font-sans`}
      >
        <ErrorBoundary>
          <AuthKitProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NotificationsProvider>
                <CalendarProvider>
                  <ClearOldSidebarCache />
                  {children}
                </CalendarProvider>
              </NotificationsProvider>
            </ThemeProvider>
          </AuthKitProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
