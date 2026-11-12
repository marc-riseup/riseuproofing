import type { Metadata } from 'next';
import Script from 'next/script';
import { Archivo, InterLocal } from './fonts';
import './globals.css';
import { buildRootGraphJsonLd, serializeJsonLd } from '@/lib/seo/metadata';
import { COMPANY_NAME } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: `San Diego Roofing Contractor | ${COMPANY_NAME}`,
    template: `%s | ${COMPANY_NAME}`,
  },
  description:
    'Licensed San Diego roofing & general building contractor (CSLB #1096492). Roof replacement, tile underlayment relay, 24/7 leak repair & solar detach-reset. Free estimates.',
  metadataBase: new URL('https://riseuprac.com'),
  keywords: [
    'san diego roofing contractor',
    'roofing company san diego',
    'roof replacement san diego',
    'tile roof relay san diego',
    'roof repair san diego',
    'commercial roofing san diego',
    'solar roofing detach and reset san diego',
    'oceanside roofing contractor',
    'carlsbad roofing company',
    'free drone roof inspection san diego',
    'roof financing san diego',
  ],
  authors: [{ name: COMPANY_NAME }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  category: 'Roofing and Construction Services',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  verification: {
    google: 'google127c05be5b9b38a9',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootGraphJsonLd = buildRootGraphJsonLd();

  return (
    <html lang="en" className={`${Archivo.variable} ${InterLocal.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased">
        {/* Google tag (gtag.js) - active on production domains only; disabled on staging, localhost, and admin */}
        <Script id="google-tag-gtag" strategy="lazyOnload">
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(rootGraphJsonLd) }}
        />
        {/* Rich analytics tracking — pageviews, clicks, scroll, forms, CTAs, session duration, UTMs */}
        <Script src="/tracker.js" strategy="lazyOnload" />
        {children}
      </body>
    </html>
  );
}
