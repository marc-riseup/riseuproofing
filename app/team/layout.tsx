import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Safety Portal | Rise Up Roofing & Construction',
  description: 'Private safety compliance portal and anonymous hazard reporting for Rise Up Roofing & Construction employees.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#F4F9FC] text-[#0B1B2B]">{children}</div>;
}
