import type { Metadata } from 'next';
import { Manrope, Inter, Noto_Sans_Ethiopic } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/src/context/authContext';
import { LanguageProvider } from '@/src/context/languageContext';
import { Navbar } from '@/src/components/Navbar';
import { BottomNav } from '@/src/components/BottomNav';

// ============================================================
// Font loading (task 9.1.3)
// ============================================================
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-noto-ethiopic',
  weight: ['300', '400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tibeb (ጥበብ) — The Digital Parchment',
  description: "Ethiopia's AI-powered study companion for Grades 7–12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${notoSansEthiopic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <LanguageProvider>
          <AuthProvider>
            {/* Top navigation — hidden on the landing page via CSS if needed */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1 pb-24 md:pb-0 lg:pr-72">
              {children}
            </main>

            {/* Mobile bottom navigation */}
            <BottomNav />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
