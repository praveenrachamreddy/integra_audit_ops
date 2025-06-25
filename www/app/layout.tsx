import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/providers/auth-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RegOps Platform - Regulatory Operations Made Simple',
  description: 'AI-powered regulatory compliance and permit management platform',
  keywords: ['regulatory', 'compliance', 'permits', 'AI', 'automation'],
  authors: [{ name: 'RegOps Platform Team' }],
  creator: 'RegOps Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://regops.com',
    title: 'RegOps Platform - Regulatory Operations Made Simple',
    description: 'AI-powered regulatory compliance and permit management platform',
    siteName: 'RegOps Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RegOps Platform - Regulatory Operations Made Simple',
    description: 'AI-powered regulatory compliance and permit management platform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-right" 
              expand={false}
              richColors
              closeButton
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}