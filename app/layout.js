import './globals.css';

export const metadata = {
  title: 'US Financial Calculators',
  description: 'Professional financial calculators for loans, mortgages, and investments using US standards',
  keywords: 'financial calculator, loan calculator, mortgage calculator, compound interest, US dollars, USD',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
