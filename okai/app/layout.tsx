import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Syne } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import 'animate.css';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/lib/hooks/use-theme';
import { I18nProvider } from '@/lib/hooks/use-i18n';
import { Toaster } from '@/components/ui/sonner';
import { ServerProvidersInit } from '@/components/server-providers-init';
import { AuthProvider } from '@/components/auth/auth-provider';

const inter = localFont({
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-sans',
  weight: '100 900',
});

const display = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'OPEN|KLASS AI',
  description:
    'OPEN|KLASS AI \u2014 Secure, multi-agent classroom generation from your source material with governed delivery and enterprise controls.',
  metadataBase: new URL('https://ok.foai.cloud'),
  openGraph: {
    title: 'OPEN|KLASS AI',
    description:
      'Secure interactive classrooms generated from source material with multi-agent instruction and governed outcomes.',
    url: 'https://ok.foai.cloud',
    siteName: 'OPEN|KLASS AI',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <I18nProvider>
            <ServerProvidersInit />
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

