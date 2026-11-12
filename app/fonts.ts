import localFont from 'next/font/local';

export const Archivo = localFont({
  src: './fonts/archivo-var.woff2',
  variable: '--font-display',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  preload: true,
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
  adjustFontFallback: 'Arial',
});

export const InterLocal = localFont({
  src: './fonts/inter-var.woff2',
  variable: '--font-inter',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
});
