/**
 * Single source of homepage copy for Rise Up 3.0.
 * Old-site claims that are not yet verified carry a `// TODO verify` marker.
 */

export const company = {
  name: 'Rise Up Roofing & Construction',
  legalName: 'Rise Up Roofing & Construction, Inc.',
  phone: '(760) 622-1230',
  phoneHref: 'tel:+17606221230',
  email: 'info@riseuprac.com',
  street: '2182 S El Camino Real',
  city: 'Oceanside',
  region: 'CA',
  zip: '92054',
  lat: 33.1759,
  lng: -117.361,
  license: '1096492',
  licenseLabel: 'CA Lic #1096492 (B & C-39)',
  ocId: '247226',
  site: 'https://riseuprac.com',
  urls: {
    google: 'https://www.google.com/maps/place/Rise+Up+Roofing+%26+Construction',
    yelp: 'https://www.yelp.com/biz/rise-up-roofing-and-construction-oceanside-2',
    oc: 'https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/247226',
    cslb: 'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1096492',
    chamber: 'https://business.escondidochamber.org/list/member/rise-up-roofing-and-construction-inc-9925',
  },
  // TODO verify: response-time promise shown on the success state of the final form.
  responseTime: 'within 2 business hours',
} as const;

export const reviewsSummary = {
  rating: '5.0',
  total: 10,
  google: 9,
  yelp: 1,
} as const;

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type Service = {
  id: string;
  tab: string;
  tabSub: string;
  icon: 'house' | 'tile' | 'wrench' | 'building' | 'sun';
  ballparkId: 'replacement' | 'tile-relay' | 'repair' | 'flat' | 'solar';
  title: string;
  badge: string;
  image: string;
  alt: string;
  // TODO verify: price ranges and durations carried over from the 2.0 site.
  cost: string;
  low: number;
  high: number;
  monthly: number;
  time: string;
  bullets: [string, string];
  link: { label: string; href: string };
};

export const featuredServices: Service[] = [
  {
    id: 'residential',
    tab: 'Residential',
    tabSub: 'Shingle & tear-off',
    icon: 'house',
    ballparkId: 'replacement',
    title: 'Residential roof replacement',
    badge: 'Up to 50-Yr OC Preferred Warranty',
    image: '/img/projects/oceanside-shingle-replacement-after',
    alt: 'Craftsman-style San Diego home with a new architectural shingle roof',
    cost: '$12,000–$26,000',
    low: 12000,
    high: 26000,
    monthly: 149,
    time: '2–4 days',
    bullets: [
      'Full tear-off to bare deck; soft plywood replaced, never covered',
      'Owens Corning Duration Cool systems rated for 130 MPH coastal wind',
    ],
    link: { label: 'Residential roofing details', href: '/services/residential' },
  },
  {
    id: 'tile',
    tab: 'Tile & underlayment',
    tabSub: 'Lift & relay',
    icon: 'tile',
    ballparkId: 'tile-relay',
    title: 'Tile lift & underlayment relay',
    badge: '30–50 Yr High-Temp Deck Shield',
    image: '/img/projects/carlsbad-tile-relayment-after',
    alt: 'Carlsbad Spanish tile roof relaid over new high-temp synthetic underlayment',
    cost: '$14,000–$28,000',
    low: 14000,
    high: 28000,
    monthly: 168,
    time: '3–5 days',
    bullets: [
      'Original clay or concrete tiles carefully lifted, stacked and saved',
      'Two layers of ASTM D4869 high-temp synthetic underlayment + new flashing',
    ],
    link: { label: 'Tile & underlayment details', href: '/services/tile-roofing' },
  },
  {
    id: 'emergency',
    tab: 'Emergency leak',
    tabSub: 'Same-day dispatch',
    icon: 'wrench',
    ballparkId: 'repair',
    title: 'Emergency leak & storm repair',
    badge: 'Same-Day Storm Tarping & Dispatch',
    image: '/img/projects/sd-attic-leak-repair-after',
    alt: 'Rise Up roofer resealing chimney flashing on a clay tile roof',
    cost: '$350–$2,500',
    low: 350,
    high: 2500,
    monthly: 49,
    time: 'Same day to 2 days',
    bullets: [
      'Tarped the same day when rain is coming in to protect ceilings and drywall',
      'Leak traced from inside the attic to the true entry point, then sealed for good',
    ],
    link: { label: 'Leak repair details', href: '/services/roof-repair' },
  },
  {
    id: 'commercial',
    tab: 'Commercial flat',
    tabSub: 'TPO & silicone',
    icon: 'building',
    ballparkId: 'flat',
    title: 'Commercial flat roofing & coatings',
    badge: '20-Yr NDL System Warranty',
    image: '/img/projects/sd-commercial-tpo-after',
    alt: 'White reflective TPO membrane on a San Diego commercial building',
    cost: '$25,000–$85,000+',
    low: 25000,
    high: 85000,
    monthly: 295,
    time: '4 days to 3 weeks',
    bullets: [
      'Heat-welded 60-mil cool TPO, silicone restoration coatings and modified bitumen',
      'Staged around tenant and business hours with zero operational downtime',
    ],
    link: { label: 'Commercial roofing details', href: '/services/commercial-roofing' },
  },
  {
    id: 'solar',
    tab: 'Solar & roof',
    tabSub: 'Detach & reset',
    icon: 'sun',
    ballparkId: 'solar',
    title: 'Solar detach, reset & integrated roofs',
    badge: 'One Crew · One Unified Warranty',
    image: '/img/projects/carlsbad-solar-detach-reset-after',
    alt: 'Carlsbad home with solar array reset over a new architectural roof',
    cost: '$2,500–$6,500',
    low: 2500,
    high: 6500,
    monthly: 65,
    time: '1–2 days (+ roof)',
    bullets: [
      'Panels safely removed, stored on-site and recommissioned over your new roof',
      'Every standoff flashed and sealed by our C-39 crew so neither warranty is voided',
    ],
    link: { label: 'Solar roofing details', href: '/services/solar-roofing' },
  },
];

export const moreServices = [
  { label: 'Metal roofing', href: '/services/metal-roofing' },
  { label: 'Roof coatings', href: '/services/roof-coating' },
  { label: 'Underlayment relay', href: '/services/tile-roofing' },
  { label: '21-Point inspection', href: '/services/roof-inspection' },
  { label: 'James Hardie siding', href: '/services/siding' },
  { label: 'Decks & patio covers', href: '/services/deck-builder' },
  { label: 'ADUs & additions', href: '/services/adu-construction' },
  { label: 'General construction', href: '/services/construction' },
];

export const navServices = [
  { label: 'Roof replacement', note: 'Tear-off and new system', href: '/services/residential', icon: 'house' },
  { label: 'Tile roofing', note: 'Clay and concrete, lift and relay', href: '/services/tile-roofing', icon: 'tile' },
  { label: 'Underlayment', note: 'The layer that actually stops water', href: '/services/tile-roofing', icon: 'layers' },
  { label: 'Leak repair', note: 'Same-day storm dispatch', href: '/services/roof-repair', icon: 'wrench' },
  { label: 'Commercial flat roofing', note: 'TPO, coatings, mod-bit', href: '/services/commercial-roofing', icon: 'building' },
  { label: 'Solar roofing', note: 'Roof and panels, one warranty', href: '/services/solar-roofing', icon: 'sun' },
  { label: 'Construction', note: 'Additions, ADUs, decks, siding', href: '/services/construction', icon: 'hardhat' },
] as const;

export const navServiceGroups = [
  {
    category: 'Residential Roofing',
    items: [
      { label: 'Residential Roofing', note: 'Owens Corning Preferred installs', href: '/services/residential', icon: 'house' as const },
      { label: 'Tile Roof Systems', note: 'Clay & concrete relay & underlayment', href: '/services/tile-roofing', icon: 'tile' as const },
      { label: 'Roof Repair & Leak Stop', note: '24/7 rapid dispatch & flashing', href: '/services/roof-repair', icon: 'wrench' as const },
      { label: 'Roof Inspections', note: '21-point forensic photo audit', href: '/services/roof-inspection', icon: 'ruler' as const },
      { label: 'Metal Roofing', note: 'Standing seam & coastal steel', href: '/services/metal-roofing', icon: 'layers' as const },
    ],
  },
  {
    category: 'Commercial Roofing',
    items: [
      { label: 'Commercial Roofing', note: 'TPO, PVC & flat roof systems', href: '/services/commercial-roofing', icon: 'building' as const },
      { label: 'Silicone Roof Coatings', note: 'Title 24 cool roof restoration', href: '/services/roof-coating', icon: 'layers' as const },
      { label: 'Modified Bitumen', note: 'Multi-ply torch & cold-applied', href: '/services/modified-bitumen', icon: 'layers' as const },
      { label: 'Industrial Roofing', note: 'Warehouses & structural decks', href: '/services/industrial-roofing', icon: 'building' as const },
      { label: 'Commercial Inspections', note: 'Core cuts & maintenance audits', href: '/services/commercial-roof-inspection', icon: 'ruler' as const },
    ],
  },
  {
    category: 'Solar & Exterior',
    items: [
      { label: 'Solar Roofing', note: 'Integrated solar + roof warranty', href: '/services/solar-roofing', icon: 'sun' as const },
      { label: 'Siding Installation', note: 'James Hardie fiber cement & stucco', href: '/services/siding', icon: 'house' as const },
      { label: 'Deck Builder', note: 'Custom waterproof decks & framing', href: '/services/deck-builder', icon: 'ruler' as const },
      { label: 'ADU Construction', note: 'Ground-up accessory dwelling units', href: '/services/adu-construction', icon: 'hardhat' as const },
      { label: 'Home Additions', note: 'Second-story & room expansions', href: '/services/home-additions', icon: 'hardhat' as const },
      { label: 'General Construction', note: 'Class B structural remodeling', href: '/services/construction', icon: 'hardhat' as const },
    ],
  },
] as const;

export const navTopCities = [
  { name: 'San Diego', slug: 'san-diego', href: '/service-area/san-diego' },
  { name: 'Oceanside', slug: 'oceanside', href: '/service-area/oceanside' },
  { name: 'Carlsbad', slug: 'carlsbad', href: '/service-area/carlsbad' },
  { name: 'Encinitas', slug: 'encinitas', href: '/service-area/encinitas' },
  { name: 'Escondido', slug: 'escondido', href: '/service-area/escondido' },
  { name: 'Poway', slug: 'poway', href: '/service-area/poway' },
  { name: 'La Jolla', slug: 'la-jolla', href: '/service-area/la-jolla' },
  { name: 'Chula Vista', slug: 'chula-vista', href: '/service-area/chula-vista' },
  { name: 'El Cajon', slug: 'el-cajon', href: '/service-area/el-cajon' },
  { name: 'Rancho Bernardo', slug: 'rancho-bernardo', href: '/service-area/rancho-bernardo' },
] as const;

export const homeSizes = [
  { value: 'lt1500', label: 'Under 1,500 sq ft', icon: 'size-sm' },
  { value: '1500-2500', label: '1,500–2,500 sq ft', icon: 'size-md' },
  { value: '2500-3500', label: '2,500–3,500 sq ft', icon: 'size-lg' },
  { value: 'gt3500', label: 'Over 3,500 sq ft', icon: 'size-xl' },
] as const;

export const ballparkServices = [
  { value: 'replacement', label: 'Roof replacement', icon: 'house' },
  { value: 'tile-relay', label: 'Tile lift & relay', icon: 'tile' },
  { value: 'repair', label: 'Leak repair', icon: 'wrench' },
  { value: 'flat', label: 'Flat / commercial roof', icon: 'building' },
  { value: 'solar', label: 'Solar detach & reset', icon: 'sun' },
] as const;

/* ------------------------------------------------------------------ */
/* Roof layers (scene 1)                                              */
/* ------------------------------------------------------------------ */

export type RoofLayer = {
  id: string;
  name: string;
  sentence: string;
  material: string;
  lifespan: string;
  specialty?: { tag: string; href: string; label: string };
  pending?: boolean;
};

// Order matches the 3D model (scenes/roof). 01 and 04 are final copy from the brief; the other seven are the
// verified 2.0 LAYERS copy, pending client sign-off.
export const roofLayers: RoofLayer[] = [
  {
    id: 'ridge-cap',
    name: 'Ridge cap',
    sentence: 'Molded caps seal the peak, where wind pulls hardest. Rated UL 2218 for 130 MPH wind.',
    material: 'ProEdge hip & ridge cap',
    lifespan: '50-yr system rated',
  },
  {
    id: 'exhaust-vents',
    name: 'Exhaust vents',
    sentence: 'Lets hot, damp attic air escape at the peak, all day and night.',
    material: 'VentSure baffled ridge vent', // from 2.0 LAYERS; client to confirm
    lifespan: '50-yr matched life',
    pending: true,
  },
  {
    id: 'shingles',
    name: 'Shingles',
    sentence: 'The first line against UV sun, Santa Ana winds and driving rain.',
    material: 'Duration Cool architectural', // from 2.0 LAYERS; client to confirm
    lifespan: '50-yr Preferred warranty',
    pending: true,
  },
  {
    id: 'underlayment',
    name: 'Underlayment',
    sentence: 'The real waterproofing under shingle or tile. Meets ASTM D4869 and is rated to 240°F.',
    material: 'High-temp woven synthetic',
    lifespan: '30–50 yr deck shield',
    specialty: { tag: 'Rise Up specialty', href: '/services/tile-roofing', label: 'How we install underlayment' },
  },
  {
    id: 'ice-water',
    name: 'Ice & water shield',
    sentence: 'A self-adhering membrane that seals eaves, valleys, skylights and nail shanks.',
    material: 'WeatherLock SBS membrane', // from 2.0 LAYERS; client to confirm
    lifespan: '50-yr self-healing seal',
    pending: true,
  },
  {
    id: 'intake-vents',
    name: 'Intake vents',
    sentence: 'Pulls cool air in at the eaves so the attic airflow loop can breathe.',
    material: 'Continuous louvered eave vent', // from 2.0 LAYERS; client to confirm
    lifespan: '50+ yr, corrosion-free',
    pending: true,
  },
  {
    id: 'decking',
    name: 'Plywood decking',
    sentence: 'The wood every layer is nailed to. Soft sheets get replaced, never covered.',
    material: '19/32 in. APA CDX plywood', // from 2.0 LAYERS; client to confirm
    lifespan: '60+ yr structural deck',
    pending: true,
  },
  {
    id: 'framing',
    name: 'Roof framing',
    sentence: 'Trusses that carry the roof and any solar. Our Class B license lets us repair them in-house.',
    material: 'Douglas fir trusses, 24 in. O.C.', // from 2.0 LAYERS; client to confirm
    lifespan: '100+ yr framing',
    pending: true,
  },
  {
    id: 'insulation',
    name: 'Insulation',
    sentence: 'Keeps attic heat out of the house and the summer cooling bill down.',
    material: 'R-38 fiberglass batts', // from 2.0 LAYERS; client to confirm
    lifespan: 'Lifetime, non-settling',
    pending: true,
  },
];

/* ------------------------------------------------------------------ */
/* Audit (scene 2)                                                    */
/* ------------------------------------------------------------------ */

export const auditStages = [
  {
    id: 'above',
    title: 'We scan from above',
    sentence: 'A drone photographs every slope, valley and mount, so nobody walks on fragile tile.',
  },
  {
    id: 'attic',
    title: 'We check inside the attic',
    sentence: 'Moisture readings around chimneys, skylights and pipe boots find leaks before the ceiling does.',
  },
  {
    id: 'report',
    title: 'You get the report',
    sentence: 'Annotated photos, remaining roof life, and repair and replace prices side by side.',
  },
];

// TODO verify: 30 minutes / 64 photos are old-site figures.
export const auditStats = [
  { value: '30', unit: 'minutes', label: 'On site, start to finish' },
  { value: '64', unit: 'photos', label: 'In a typical report' },
  { value: '$0', unit: '', label: 'No cost, no obligation' },
];

/* ------------------------------------------------------------------ */
/* Projects                                                           */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  title: string;
  city: string;
  size: string;
  days: string;
  material: string;
  warranty: string;
  summary: string;
  beforeAlt: string;
  afterAlt: string;
};

export const galleryProjects: Project[] = [
  {
    slug: 'carlsbad-tile-relayment',
    title: 'Tile underlayment relay',
    city: 'Carlsbad',
    size: '3,400 sq ft',
    days: '5 days',
    material: 'Dual-layer high-temp synthetic',
    warranty: '30-year underlayment & workmanship warranty',
    summary: 'Original concrete S-tiles lifted and saved, 25-year-old felt replaced with two layers of high-temp synthetic.',
    beforeAlt: 'Carlsbad tile roof before: cracked felt visible under lifted tiles',
    afterAlt: 'Carlsbad tile roof after: tiles relaid over new synthetic underlayment',
  },
  {
    slug: 'oceanside-shingle-replacement',
    title: 'Shingle roof replacement',
    city: 'Oceanside',
    size: '2,600 sq ft',
    days: '3 days',
    material: 'Owens Corning Duration Cool',
    warranty: '50-year Owens Corning system warranty',
    summary: 'Tear-off to bare deck, six rotted plywood sheets replaced, cool-rated shingles for coastal wind.',
    beforeAlt: 'Oceanside home before: curling, granule-worn three-tab shingles',
    afterAlt: 'Oceanside home after: new architectural shingle roof',
  },
  {
    slug: 'sd-commercial-tpo',
    title: 'Commercial TPO roof',
    city: 'San Diego',
    size: '14,500 sq ft',
    days: '6 days',
    material: '60-mil reflective TPO',
    warranty: '20-year NDL system warranty',
    summary: 'Tapered insulation for drainage and a heat-welded white membrane on a working facility.',
    beforeAlt: 'Commercial flat roof before: ponding and worn cap sheet',
    afterAlt: 'Commercial flat roof after: white TPO membrane',
  },
  {
    slug: 'sd-attic-leak-repair',
    title: 'Chimney leak repair',
    city: 'Poway',
    size: '300 sq ft zone',
    days: '1.5 days',
    material: 'Custom metal cricket & flashing',
    warranty: '10-year flashing & leak warranty',
    summary: 'Leak traced from the attic to the chimney, then a custom cricket built to send water around it.',
    beforeAlt: 'Poway chimney before: failed flashing and water staining',
    afterAlt: 'Poway chimney after: new metal cricket and flashing',
  },
];

export type PinCategory = 'residential' | 'leak' | 'commercial' | 'solar';

export const pinCategories: Record<PinCategory, { label: string; color: string }> = {
  residential: { label: 'Residential', color: '#0C1E3A' },
  leak: { label: 'Leak repair', color: '#E0372A' },
  commercial: { label: 'Commercial', color: '#2E8FD6' },
  solar: { label: 'Solar', color: '#E8A800' },
};

export type Pin = {
  id: string;
  title: string;
  city: string;
  slug: string;
  cat: PinCategory;
  lat: number;
  lng: number;
  days: string;
  size: string;
  image: string;
};

export const mapPins: Pin[] = [
  { id: 'p1', title: 'Shingle roof replacement', city: 'Oceanside', slug: 'oceanside', cat: 'residential', lat: 33.1885, lng: -117.3452, days: '3 days', size: '2,600 sq ft', image: '/img/projects/oceanside-shingle-replacement-after' },
  { id: 'p2', title: 'Tile underlayment relay', city: 'Carlsbad', slug: 'carlsbad', cat: 'residential', lat: 33.0952, lng: -117.2712, days: '5 days', size: '3,400 sq ft', image: '/img/projects/carlsbad-tile-relayment-after' },
  { id: 'p3', title: 'Roof replacement + solar reset', city: 'Carlsbad', slug: 'carlsbad', cat: 'solar', lat: 33.1128, lng: -117.2985, days: '4 days', size: '2,950 sq ft', image: '/img/projects/carlsbad-solar-detach-reset-after' },
  { id: 'p4', title: 'Patio cover & roof tie-in', city: 'Encinitas', slug: 'encinitas', cat: 'residential', lat: 33.0482, lng: -117.2356, days: '10 days', size: '520 sq ft', image: '/img/projects/sd-patio-cover-after' },
  { id: 'p5', title: 'Leak under solar array', city: 'San Marcos', slug: 'san-marcos', cat: 'solar', lat: 33.1365, lng: -117.1714, days: '2 days', size: '600 sq ft', image: '/img/projects/sd-solar-tile-repair-after' },
  { id: 'p6', title: 'Silicone roof coating', city: 'Escondido', slug: 'escondido', cat: 'commercial', lat: 33.1192, lng: -117.0864, days: '4 days', size: '9,200 sq ft', image: '/img/projects/escondido-roof-coating-after' },
  { id: 'p7', title: 'Underlayment & deck repair', city: 'Escondido', slug: 'escondido', cat: 'leak', lat: 33.1445, lng: -117.0652, days: '2 days', size: '800 sq ft', image: '/img/projects/sd-underlayment-repair-after' },
  { id: 'p8', title: 'Chimney leak repair', city: 'Poway', slug: 'poway', cat: 'leak', lat: 32.9628, lng: -117.0359, days: '1.5 days', size: '300 sq ft', image: '/img/projects/sd-attic-leak-repair-after' },
  { id: 'p9', title: 'Commercial TPO roof', city: 'San Diego', slug: 'san-diego', cat: 'commercial', lat: 32.8856, lng: -117.1489, days: '6 days', size: '14,500 sq ft', image: '/img/projects/sd-commercial-tpo-after' },
  { id: 'p10', title: 'Valley flashing leak repair', city: 'San Diego', slug: 'san-diego', cat: 'leak', lat: 32.9522, lng: -117.2314, days: '1 day', size: '450 sq ft', image: '/img/projects/sd-broken-tile-repair-after' },
  { id: 'p11', title: 'Siding & fascia renewal', city: 'Oceanside', slug: 'oceanside', cat: 'residential', lat: 33.2015, lng: -117.3188, days: '8 days', size: '2,200 sq ft', image: '/img/projects/oceanside-siding-after' },
];

export const mapCities = [
  { name: 'Oceanside', slug: 'oceanside' },
  { name: 'Carlsbad', slug: 'carlsbad' },
  { name: 'Encinitas', slug: 'encinitas' },
  { name: 'San Marcos', slug: 'san-marcos' },
  { name: 'Escondido', slug: 'escondido' },
  { name: 'Poway', slug: 'poway' },
  { name: 'San Diego', slug: 'san-diego' },
];

/* ------------------------------------------------------------------ */
/* Reviews (verbatim from the client's Google / Yelp screenshots)      */
/* ------------------------------------------------------------------ */

export type Review = {
  id: string;
  name: string;
  initials: string;
  city: string;
  tag: string;
  source: 'Google' | 'Yelp';
  text: string;
};

export const reviews: Review[] = [
  {
    id: 'kathy-v',
    name: 'Kathy V',
    initials: 'KV',
    city: 'Oceanside',
    tag: 'Tile roof lift & relay',
    source: 'Google',
    text: 'We used Rise Up Roofing for our tile roof underlayment replacement in Oceanside. They carefully removed all our existing tiles, replaced the old paper with two layers of heavy-duty synthetic underlayment, replaced broken tiles, and left our driveway and flowerbeds cleaner than when they arrived. Wonderful family-owned company!',
  },
  {
    id: 'javier-melchor',
    name: 'Javier Melchor',
    initials: 'JM',
    city: 'San Diego',
    tag: 'Commercial flat roof coating',
    source: 'Google',
    text: 'Professional, punctual, and fair pricing. Luis inspected our commercial flat roof, showed us drone photos of all the seams and ponding areas, and applied a silicone cool roof coating system that stopped our leaks and saved us thousands compared to a full tear-off. Highly recommend Rise Up for any commercial or residential roofing needs.',
  },
  {
    id: 'robert-maria',
    name: 'Robert & Maria T.',
    initials: 'RM',
    city: 'Escondido',
    tag: 'Tile restoration & patio cover',
    source: 'Yelp',
    text: 'They repaired our historic tile roof and built our second-story patio cover. Quality craftsmanship and constant communication throughout the whole process.',
  },
  {
    id: 't-hobart',
    name: 'T Hobart',
    initials: 'TH',
    city: 'San Diego County',
    tag: 'Roof inspection',
    source: 'Google',
    text: "Luis came out to inspect our roof and give us an estimate for maintenance. He was on time, polite, professional and honest. He took pictures of the roof and explained everything clearly. Instead of trying to upsell us on work we didn't need, he gave us an honest assessment that our roof was still in great shape and only needed minor preventative maintenance. Highly recommend Rise Up Roofing!",
  },
  {
    id: 'steve-ponce',
    name: 'Steve Ponce',
    initials: 'SP',
    city: 'Oceanside',
    tag: 'Full roof replacement',
    source: 'Google',
    text: 'Rise Up Roofing did an amazing job on our full roof replacement! From the first consultation with Luis and Edith to the final cleanup, the communication was outstanding. They sent daily photo updates showing the tear-off, wood repairs, underlayment, and new shingles. The crew worked hard, kept our yard spotless every evening, and finished right on schedule. Best roofing company in North County!',
  },
  {
    id: 'gustavo-bernal',
    name: 'Gustavo Bernal',
    initials: 'GB',
    city: 'Carlsbad',
    tag: 'Tile underlayment & repair',
    source: 'Google',
    text: "Great experience working with Rise Up Roofing and Construction. They repaired a stubborn leak on our Spanish tile roof that two other companies couldn't fix. Luis went into the attic, traced the water path, and showed us exact photos of the cracked underlayment and valley flashing. Fair price, top quality workmanship, and very respectful crew.",
  },
  {
    id: 'rosanna-cesena',
    name: 'Rosanna Cesena',
    initials: 'RC',
    city: 'Vista',
    tag: 'Emergency leak repair',
    source: 'Google',
    text: 'We had an unexpected roof leak during the heavy rain and Edith and Luis responded right away. They came out the same day to tarp and secure the area, then returned as soon as the weather cleared to complete the permanent repair. Their pricing was very fair and itemized with before and after photos. So grateful for their fast help!',
  },
  {
    id: 'alexandria-v',
    name: 'Alexandria V',
    initials: 'AV',
    city: 'San Marcos',
    tag: 'Roof replacement & gutters',
    source: 'Google',
    text: "Luis, Edith, and the entire Rise Up crew exceeded our expectations! We got quotes from four different San Diego roofing companies and Rise Up gave us the most thorough inspection and the clearest, most transparent quote. No pushy sales tactics at all. Our new Owens Corning roof looks incredible and has completely transformed our home's curb appeal.",
  },
  {
    id: 'daved-garcia',
    name: 'Daved Garcia',
    initials: 'DG',
    city: 'Encinitas',
    tag: 'Roofing & patio cover',
    source: 'Google',
    text: 'Top notch craftsmanship from start to finish. Rise Up handled both our roof repair and patio cover construction seamlessly. Having a contractor licensed for both roofing and general construction saved us from hiring two separate companies. They showed up on time every morning and delivered exactly what they promised.',
  },
  {
    id: 'damian-diaz',
    name: 'Damian Enrique Diaz',
    initials: 'DD',
    city: 'Escondido',
    tag: 'Residential reroof',
    source: 'Google',
    text: "If you're looking for a reliable, honest, and skilled roofing contractor in San Diego, call Rise Up Roofing. Luis and his team replaced our aging roof and repaired several rotted fascia boards. Their attention to detail on the flashing and ridge vents was impressive, and they passed city inspection without a single issue. Five stars all the way!",
  },
];

/* ------------------------------------------------------------------ */
/* Credentials                                                        */
/* ------------------------------------------------------------------ */

export const credentials = [
  { id: 'cslb', name: 'CSLB license', detail: '#1096492 (B & C-39)', logo: '/img/brand/cslb.webp', w: 112, h: 112, href: company.urls.cslb },
  { id: 'oc', name: 'Owens Corning Preferred', detail: 'Contractor ID #247226', logo: '/img/brand/oc-preferred-seal.webp', w: 280, h: 280, href: company.urls.oc },
  { id: 'chamber', name: 'Escondido Chamber', detail: 'Member business', logo: '/img/brand/escondido-chamber.webp', w: 140, h: 120, href: company.urls.chamber },
  // TODO: add the San Diego Regional Chamber logo + the member-listing URL (not in the 2.0 assets).
  { id: 'sdchamber', name: 'San Diego Chamber', detail: 'Member business', logo: '', w: 0, h: 0, href: 'https://sdchamber.org/' },
] as const;

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    q: 'How much does a new roof cost in San Diego?',
    // TODO verify: price ranges from the 2.0 site.
    a: 'Most repairs land between $350 and $2,500. A full shingle replacement or a tile lift-and-relay usually runs $12,000 to $26,000, depending on size, pitch and the roof underneath. Your free inspection ends with an itemized quote that shows repair and replacement prices side by side.',
  },
  {
    q: 'How long does a roof replacement take?',
    // TODO verify: durations from the 2.0 site.
    a: 'A shingle replacement is usually 2 to 4 days from tear-off to final cleanup. Tile lift-and-relay jobs take 3 to 5 days. Emergency leaks are tarped the same day when weather allows.',
  },
  {
    q: 'Does the warranty transfer if I sell my home?',
    a: 'Yes. Our Owens Corning system warranties and our written workmanship guarantee transfer to the next owner, which buyers and inspectors notice during escrow.',
  },
  {
    q: 'Do you pull permits and handle the city inspection?',
    a: 'Yes. We are licensed for roofing (C-39) and general building (Class B), and we pull the permit, prepare HOA paperwork when needed, and meet the city inspector for the final sign-off.',
  },
  {
    q: 'Do you offer financing?',
    // TODO verify: financing terms ($0 down, monthly ranges) with the lender before publishing figures.
    a: 'Yes. We offer $0-down financing with fixed monthly payments, and pre-approval is a soft credit check that does not affect your score. Ask for current rates at your inspection.',
  },
];

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

export const footerCapabilities = [
  { label: 'Free 21-Point Roof Inspection', href: '/services/roof-inspection' },
  { label: 'Residential roof replacement', href: '/services/residential' },
  { label: 'Leak repair & emergency', href: '/services/roof-repair' },
  { label: 'Tile roof & underlayment relay', href: '/services/tile-roofing' },
  { label: 'Commercial TPO & flat roofing', href: '/services/commercial-roofing' },
  { label: 'Solar roofing & detach/reset', href: '/services/solar-roofing' },
  { label: 'Standing seam metal roofing', href: '/services/metal-roofing' },
  { label: 'Silicone & acrylic coatings', href: '/services/roof-coating' },
  { label: 'Modified bitumen', href: '/services/modified-bitumen' },
  { label: 'Industrial & warehouse roofing', href: '/services/industrial-roofing' },
  { label: 'Commercial roof inspections', href: '/services/commercial-roof-inspection' },
  { label: 'General contracting', href: '/services/construction' },
  { label: 'Home & room additions', href: '/services/home-additions' },
  { label: 'ADU construction', href: '/services/adu-construction' },
  { label: 'Decks & patio covers', href: '/services/deck-builder' },
  { label: 'James Hardie siding', href: '/services/siding' },
  { label: 'Roof financing', href: '/roof-financing-san-diego' },
];

export const footerCompany = [
  { label: 'About Rise Up', href: '/about' },
  { label: 'Roof Tear-Off Process', href: '/about/roof-tear-off-process' },
  { label: 'Our Projects', href: '/projects' },
  { label: 'Customer Reviews', href: '/reviews' },
  { label: 'Service Areas', href: '/service-area' },
  { label: 'Financing Options', href: '/roof-financing-san-diego' },
  { label: 'Roofing Guides', href: '/guides' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
];

const c = (name: string) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return { name, slug, href: `/service-area/${slug}` };
};

export const footerRegions = [
  {
    region: 'North County coastal',
    cities: ['Oceanside', 'Carlsbad', 'Encinitas', 'Solana Beach', 'Del Mar', 'Rancho Santa Fe', 'Camp Pendleton'].map(c),
  },
  {
    region: 'North County inland',
    cities: ['Vista', 'San Marcos', 'Escondido', 'Poway', 'Fallbrook', 'Bonsall', 'Valley Center', 'Ramona', 'Rancho Bernardo'].map(c),
  },
  {
    region: 'Central & coastal San Diego',
    cities: ['San Diego', 'La Jolla', 'Coronado'].map(c),
  },
  {
    region: 'East County',
    cities: ['El Cajon', 'La Mesa', 'Santee', 'Lakeside', 'Alpine', 'Rancho San Diego', 'Spring Valley', 'Lemon Grove'].map(c),
  },
  {
    region: 'South Bay & Southwest Riverside',
    cities: ['Chula Vista', 'National City', 'Imperial Beach', 'Temecula', 'Murrieta'].map(c),
  },
];
