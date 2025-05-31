import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Financial Calculators',
  description: 'Comprehensive suite of financial calculators including tax, investment, loan, and retirement planning tools.',
  keywords: 'financial calculator, tax calculator, investment calculator, loan calculator, retirement calculator, SIP calculator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Navbar />
          {children}
        <Analytics />
      </body>
    </html>
  );
}
