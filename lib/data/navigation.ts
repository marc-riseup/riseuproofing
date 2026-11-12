/* ─── Architectural Spec Mega-Menu Columns (16/16 Unique Scopes) ─── */
export const SERVICES_MEGA_MENU = [
  {
    category: 'Residential & Tile Roofing',
    href: '/services/residential',
    description: 'CRC R908 tear-offs, tile relays & 24/7 leak repair',
    items: [
      { label: 'Architectural Shingle Reroofing', href: '/services/residential' },
      { label: 'Clay & Concrete Tile Relay', href: '/services/tile-roofing' },
      { label: 'Standing Seam Metal Roofing', href: '/services/metal-roofing' },
      { label: '24/7 Emergency Leak Repair', href: '/services/roof-repair' },
      { label: '21-Point Drone & Thermal Audit', href: '/services/roof-inspection' },
    ],
  },
  {
    category: 'Commercial & Solar Roofing',
    href: '/services/commercial-roofing',
    description: '60-mil TPO, silicone coatings & solar resets',
    items: [
      { label: 'Commercial TPO & Flat Roofs', href: '/services/commercial-roofing' },
      { label: 'Solar Panel Detach & Reset', href: '/services/solar-roofing' },
      { label: 'High-Solids Silicone Coatings', href: '/services/roof-coating' },
      { label: 'Modified Bitumen & BUR', href: '/services/modified-bitumen' },
      { label: 'Industrial & Warehouse Roofs', href: '/services/industrial-roofing' },
      { label: 'Commercial Infrared Audits', href: '/services/commercial-roof-inspection' },
    ],
  },
  {
    category: 'Class B Construction & ADUs',
    href: '/services/construction',
    description: 'Permitted decks, Hardie siding & detached ADUs',
    items: [
      { label: 'Custom Trex & View Decks', href: '/services/deck-builder' },
      { label: 'James Hardie Siding', href: '/services/siding' },
      { label: 'Permitted ADU Construction', href: '/services/adu-construction' },
      { label: 'Room & Second-Story Additions', href: '/services/home-additions' },
      { label: 'Patio Covers & Exterior Framing', href: '/services/construction' },
    ],
  },
];

export const SERVICES_NAV = SERVICES_MEGA_MENU.flatMap((col) => col.items);

/* ─── Service Area Cities ─── */
export const TOP_CITIES = [
  { name: 'San Diego', slug: 'san-diego' },
  { name: 'Oceanside', slug: 'oceanside' },
  { name: 'Carlsbad', slug: 'carlsbad' },
  { name: 'Encinitas', slug: 'encinitas' },
  { name: 'Vista', slug: 'vista' },
  { name: 'San Marcos', slug: 'san-marcos' },
  { name: 'Escondido', slug: 'escondido' },
  { name: 'La Jolla', slug: 'la-jolla' },
  { name: 'Del Mar', slug: 'del-mar' },
  { name: 'Rancho San Diego', slug: 'rancho-san-diego' },
];
