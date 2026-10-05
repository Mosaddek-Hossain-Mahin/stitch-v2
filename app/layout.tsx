import type { Metadata } from 'next';
import './globals.css';
import { MedusaProvider } from '@/lib/medusa/context';

export const metadata: Metadata = {
  title: 'Stitch BD — Graded Patterns & Dhaka Atelier',
  description:
    'Multi-region commerce storefront for graded digital sewing patterns with secure S3 delivery and made-to-order Dhaka atelier garments in heritage Bangladeshi textiles.',
  openGraph: {
    title: 'Stitch BD — Graded Patterns & Dhaka Atelier',
    description:
      'Multi-region commerce storefront for graded digital sewing patterns with secure S3 delivery and made-to-order Dhaka atelier garments in heritage Bangladeshi textiles.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stitch BD — Graded Patterns & Dhaka Atelier',
    description:
      'Multi-region commerce storefront for graded digital sewing patterns with secure S3 delivery and made-to-order Dhaka atelier garments in heritage Bangladeshi textiles.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#FDFBF7] text-zinc-900" suppressHydrationWarning>
        <MedusaProvider>{children}</MedusaProvider>
      </body>
    </html>
  );
}
