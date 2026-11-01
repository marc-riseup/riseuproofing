/** San Diego County service-area lookup (shared by both forms). */

const ZIP_CITY: Record<string, string> = {
  '91901': 'Alpine', '91902': 'Bonita', '91910': 'Chula Vista', '91911': 'Chula Vista', '91913': 'Chula Vista',
  '91914': 'Chula Vista', '91915': 'Chula Vista', '91941': 'La Mesa', '91942': 'La Mesa', '91945': 'Lemon Grove',
  '91950': 'National City', '92003': 'Bonsall', '92007': 'Cardiff-by-the-Sea', '92008': 'Carlsbad', '92009': 'Carlsbad',
  '92010': 'Carlsbad', '92011': 'Carlsbad', '92014': 'Del Mar', '92019': 'El Cajon', '92020': 'El Cajon',
  '92021': 'El Cajon', '92024': 'Encinitas', '92025': 'Escondido', '92026': 'Escondido', '92027': 'Escondido',
  '92028': 'Fallbrook', '92029': 'Escondido', '92037': 'La Jolla', '92040': 'Lakeside', '92054': 'Oceanside',
  '92056': 'Oceanside', '92057': 'Oceanside', '92058': 'Oceanside', '92064': 'Poway', '92065': 'Ramona',
  '92067': 'Rancho Santa Fe', '92069': 'San Marcos', '92071': 'Santee', '92075': 'Solana Beach', '92078': 'San Marcos',
  '92081': 'Vista', '92082': 'Valley Center', '92083': 'Vista', '92084': 'Vista', '92091': 'Rancho Santa Fe',
  '92101': 'San Diego', '92102': 'San Diego', '92103': 'Hillcrest', '92104': 'North Park', '92106': 'Point Loma',
  '92107': 'Ocean Beach', '92108': 'Mission Valley', '92109': 'Pacific Beach', '92110': 'Bay Park', '92111': 'Clairemont',
  '92115': 'College Area', '92116': 'Normal Heights', '92117': 'Clairemont', '92118': 'Coronado', '92119': 'San Carlos',
  '92120': 'Allied Gardens', '92121': 'Sorrento Valley', '92122': 'University City', '92123': 'Kearny Mesa',
  '92124': 'Tierrasanta', '92126': 'Mira Mesa', '92127': 'Rancho Bernardo', '92128': 'Rancho Bernardo',
  '92129': 'Rancho Peñasquitos', '92130': 'Carmel Valley', '92131': 'Scripps Ranch',
};

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
  // 919xx, 920xx and 921xx are San Diego County delivery areas.
  if (/^9(19|20|21)\d\d$/.test(zip)) return { state: 'served', zip, city: ZIP_CITY[zip] ?? null };
  if (/^9\d{4}$/.test(zip)) return { state: 'outside', zip };
  return { state: 'invalid' };
}

export function zipMessage(check: ZipCheck): string {
  switch (check.state) {
    case 'served':
      return check.city ? `Yes, we serve ${check.city} (${check.zip})` : `Yes, we serve your area (${check.zip})`;
    case 'outside':
      return `${check.zip} is outside San Diego County. Call us and we will tell you honestly if we can help.`;
    case 'invalid':
      return 'Enter a 5-digit California ZIP.';
    default:
      return '';
  }
}
