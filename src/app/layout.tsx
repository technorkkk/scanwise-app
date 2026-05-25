import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ScanWise — Know What You Eat',
    template: '%s | ScanWise',
  },
  description:
    'Scan any food barcode and get instant, trustworthy insights on nutrition, ingredients, allergens, processing level, and health impact. Powered by AI.',
  keywords: [
    'ScanWise',
    'food scanner',
    'barcode scanner',
    'nutrition',
    'health',
    'allergens',
    'Nutri-Score',
    'NOVA',
    'food safety',
    'AI food analysis',
  ],
  authors: [{ name: 'ScanWise Team' }],
  creator: 'ScanWise',
  metadataBase: new URL('https://scanwise.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scanwise.app',
    siteName: 'ScanWise',
    title: 'ScanWise — Know What You Eat',
    description: 'Scan any food barcode and get instant, trustworthy health insights.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ScanWise' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScanWise — Know What You Eat',
    description: 'Scan any food barcode and get instant, trustworthy health insights.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ScanWise',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#059669' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <I18nProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                className: 'glass-strong',
              }}
            />
            {/* PWA Service Worker Registration */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js').catch(function() {});
                    });
                  }
                `,
              }}
            />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
