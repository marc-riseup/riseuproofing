import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function WarrantyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="site-page-shell">{children}</div>;
}
