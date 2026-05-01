import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rhytutor - Music Learning Platform',
  description: 'Learn from the best musicians in the world.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            <DataProvider>
              <div className="app-container">
                <Navbar />
                <main className="main-content">
                  {children}
                </main>
              </div>
            </DataProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
