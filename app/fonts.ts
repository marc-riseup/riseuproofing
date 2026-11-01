import localFont from 'next/font/local';

/**
 * Display: Archivo variable (wght 100–900, wdth 62–125). Same grotesk as the hero benchmark,
 * set heavy (800) and slightly expanded (wdth 108–112). Also carries UI labels.
 */
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

/**
 * Body: Inter variable (wght 100–900), the body sans of the previous site, self-hosted from
 * @fontsource-variable/inter so it cannot fail to load. Fallback is metric-matched Arial
 * (next/font generates size-adjust / ascent / descent overrides) to avoid layout shift.
 */
export const Inter = localFont({
  src: './fonts/inter-var.woff2',
  variable: '--font-body',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
});
