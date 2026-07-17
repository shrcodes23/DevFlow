import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider, AuthProvider } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'DevFlow AI — AI-Powered GitHub Project Management',
  description: 'Plan sprints, triage issues, and review pull requests with AI superpowers.',
  openGraph: { images: [{ url: 'https://bolt.new/static/og_default.png' }] },
  twitter: { card: 'summary_large_image', images: [{ url: 'https://bolt.new/static/og_default.png' }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
