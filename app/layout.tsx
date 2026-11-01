import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { BRAND_DATA } from '@/lib/brand-data';
import { LeadModalProvider } from '@/context/LeadModalContext';
import { UnifiedLeadModal } from '@/components/shared/UnifiedLeadModal';
import { Archivo, Inter } from './fonts';
import './styles/website.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sky.css';
import './styles/chrome.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/scenes.css';
import './styles/closing.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://riseuprac.com'),
  title: 'San Diego Roofing & Construction Experts | Rise Up Roofing & Construction',
  description:
    'Licensed San Diego roofer (CA Lic #1096492, B & C-39) and Owens Corning Preferred Contractor. Roof replacement, tile underlayment, leak repair and a free 21-point roof inspection.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Rise Up Roofing & Construction',
    description: 'San Diego roofing and construction. Free 21-point roof inspection.',
    url: 'https://riseuprac.com',
    siteName: 'Rise Up Roofing & Construction',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  icons: { icon: BRAND_DATA.favicon },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#4AB4F0',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${Archivo.variable} ${Inter.variable}`} data-chrome-tone="light" data-bar-tone="light" data-red-busy="">
      <body>
        <Script id="google-tag-gtag" strategy="afterInteractive">
          {`
            var isStagingOrDev = (
              window.location.hostname === 'website.riseuprac.com' ||
              window.location.hostname.indexOf('staging') !== -1 ||
              window.location.hostname === 'localhost' ||
              window.location.hostname === '127.0.0.1' ||
              window.location.pathname.startsWith('/admin')
            );
            if (isStagingOrDev) {
              window['ga-disable-G-82QZ88P6TK'] = true;
            } else {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-82QZ88P6TK');
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=G-82QZ88P6TK';
              document.head.appendChild(s);
            }
          `}
        </Script>
        <Script src="/tracker.js" strategy="afterInteractive" />
        <LeadModalProvider>
          {children}
          <UnifiedLeadModal />
        </LeadModalProvider>
      </body>
    </html>
  );
}
