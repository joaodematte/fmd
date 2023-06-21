import ToasterContainer from '@/components/ToasterContainer';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

export const metadata = {
  title: 'fmd.sh — An AI-powered markdown text editor',
  description: 'fmd.sh — An AI-powered markdown text editor.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ToasterContainer />
        {children}
      </body>
    </html>
  );
}
