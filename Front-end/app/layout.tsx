import type { Metadata } from "next";
import { Shantell_Sans, Inter, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';
import { NotificationsProvider } from "@/contexts/notifications-context";
import { CalendarProvider } from "@/contexts/calendar-context";
import "./globals.css";

const shantellSans = Shantell_Sans({
  variable: "--font-shantell-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
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
        <AuthKitProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NotificationsProvider>
              <CalendarProvider>
                {children}
              </CalendarProvider>
            </NotificationsProvider>
          </ThemeProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
