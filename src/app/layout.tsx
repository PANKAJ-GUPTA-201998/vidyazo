import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidyazo - A New Way to Learn | Online Tuition",
  description:
    "Personal tuition for Class 6-12 students & competitive exams. Live classes, weekly tests, progress reports, and WhatsApp updates for parents.",
  keywords: [
    "online tuition",
    "smart tuition",
    "class 6-12",
    "CBSE",
    "ICSE",
    "India",
    "vidyazo",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Vidyazo - A New Way to Learn",
    description: "Personal tuition for Class 6-12 students & competitive exams",
    siteName: "Vidyazo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
