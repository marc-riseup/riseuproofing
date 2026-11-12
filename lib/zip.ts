/** San Diego County + South Riverside (Temecula & Murrieta) service-area lookup. */

const ZIP_CITY: Record<string, string> = {
  // South & East County (919xx)
  '91901': 'Alpine',
  '91902': 'Bonita',
  '91905': 'Boulevard',
  '91906': 'Campo',
  '91910': 'Chula Vista',
  '91911': 'Chula Vista',
  '91913': 'Chula Vista',
  '91914': 'Chula Vista',
  '91915': 'Chula Vista',
  '91916': 'Descanso',
  '91917': 'Dulzura',
  '91931': 'Guatay',
  '91932': 'Imperial Beach',
  '91934': 'Jacumba',
  '91935': 'Jamul',
  '91941': 'La Mesa',
  '91942': 'La Mesa',
  '91945': 'Lemon Grove',
  '91948': 'Mount Laguna',
  '91950': 'National City',
  '91962': 'Pine Valley',
  '91963': 'Potrero',
  '91977': 'Spring Valley',
  '91978': 'Spring Valley',
  '91980': 'Tecate',

  // North County Coastal & Inland (920xx)
  '92003': 'Bonsall',
  '92004': 'Borrego Springs',
  '92007': 'Cardiff-by-the-Sea',
  '92008': 'Carlsbad',
  '92009': 'Carlsbad',
  '92010': 'Carlsbad',
  '92011': 'Carlsbad',
  '92014': 'Del Mar',
  '92019': 'Rancho San Diego',
  '92020': 'El Cajon',
  '92021': 'El Cajon',
  '92024': 'Encinitas',
  '92025': 'Escondido',
  '92026': 'Escondido',
  '92027': 'Escondido',
  '92028': 'Fallbrook',
  '92029': 'Escondido',
  '92036': 'Julian',
  '92037': 'La Jolla',
  '92040': 'Lakeside',
  '92054': 'Oceanside',
  '92055': 'Camp Pendleton',
  '92056': 'Oceanside',
  '92057': 'Oceanside',
  '92058': 'Oceanside',
  '92059': 'Pala',
  '92060': 'Palomar Mountain',
  '92061': 'Pauma Valley',
  '92064': 'Poway',
  '92065': 'Ramona',
  '92067': 'Rancho Santa Fe',
  '92069': 'San Marcos',
  '92070': 'Santa Ysabel',
  '92071': 'Santee',
  '92075': 'Solana Beach',
  '92078': 'San Marcos',
  '92081': 'Vista',
  '92082': 'Valley Center',
  '92083': 'Vista',
  '92084': 'Vista',
  '92086': 'Warner Springs',
  '92091': 'Rancho Santa Fe',

  // San Diego Metro & Coast (921xx)
  '92101': 'San Diego',
  '92102': 'San Diego',
  '92103': 'Hillcrest',
  '92104': 'North Park',
  '92105': 'City Heights',
  '92106': 'Point Loma',
  '92107': 'Ocean Beach',
  '92108': 'Mission Valley',
  '92109': 'Pacific Beach',
  '92110': 'Bay Park',
  '92111': 'Clairemont',
  '92113': 'San Diego',
  '92114': 'San Diego',
  '92115': 'College Area',
  '92116': 'Normal Heights',
  '92117': 'Clairemont',
  '92118': 'Coronado',
  '92119': 'San Carlos',
  '92120': 'Allied Gardens',
  '92121': 'Sorrento Valley',
  '92122': 'University City',
  '92123': 'Kearny Mesa',
  '92124': 'Tierrasanta',
  '92126': 'Mira Mesa',
  '92127': 'Rancho Bernardo',
  '92128': 'Rancho Bernardo',
  '92129': 'Rancho Peñasquitos',
  '92130': 'Carmel Valley',
  '92131': 'Scripps Ranch',
  '92139': 'Paradise Hills',
  '92154': 'Otay Mesa',
  '92173': 'San Ysidro',

  // South Riverside Service Area
  '92562': 'Murrieta',
  '92563': 'Murrieta',
  '92564': 'Murrieta',
  '92589': 'Temecula',
  '92590': 'Temecula',
  '92591': 'Temecula',
  '92592': 'Temecula',
  '92593': 'Temecula',
};

const SOUTH_RIVERSIDE_RE = /^925(6[2-4]|89|9[0-3])$/;

export type ZipCheck =
  | { state: 'empty' }
  | { state: 'partial' }
  | { state: 'served'; zip: string; city: string | null }
  | { state: 'outside'; zip: string }
  | { state: 'invalid' };

export function checkZip(raw: string): ZipCheck {
  const zip = raw.replace(/\D/g, '').slice(0, 5);
  if (!zip) return { state: 'empty' };
  if (zip.length < 5) return { state: 'partial' };
  if (/^9(19|20|21)\d\d$/.test(zip) || SOUTH_RIVERSIDE_RE.test(zip)) {
    const city = ZIP_CITY[zip] ?? (zip.startsWith('921') ? 'San Diego' : null);
    return { state: 'served', zip, city };
  }
  if (/^9\d{4}$/.test(zip)) return { state: 'outside', zip };
  return { state: 'invalid' };
}

export function zipMessage(check: ZipCheck): string {
  switch (check.state) {
    case 'served':
      return check.city ? `Yes, we serve ${check.city} (${check.zip})` : `Yes, we serve your area (${check.zip})`;
    case 'outside':
      return `${check.zip} is outside San Diego County & South Riverside. Call (760) 622-1230 and we will confirm if we can help.`;
    case 'invalid':
      return 'Enter a valid 5-digit California ZIP code.';
    default:
      return '';
  }
}
