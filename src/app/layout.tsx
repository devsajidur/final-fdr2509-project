import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mack Anthem® | Built for the Road Ahead',
  description:
    'The Mack Anthem combines proven reliability with advanced technology and driver comfort. Engineered for long-haul efficiency and built to handle the toughest jobs.',
  keywords: ['Mack Anthem', 'Mack Trucks', 'Highway Truck', 'Commercial Vehicles', 'MP8 Engine'],
  authors: [{ name: 'Mack Trucks' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#F9FAFB] text-[#111827]"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
