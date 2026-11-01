import { company, credentials } from '@/lib/content';

const CLAIMS = [
  {
    title: 'Owens Corning Preferred Contractor',
    text: 'Vetted by the manufacturer for installation standards, licensing and insurance, which is what lets us register their longest system warranties.',
  },
  {
    title: 'In-house crews, zero subcontractors',
    text: 'The people on your roof work for us. Luis or a foreman is on site every day of the job.',
  },
  {
    title: 'Up to 50-year system warranties',
    text: 'Owens Corning material and system coverage, plus our own written workmanship guarantee.',
  },
  {
    title: 'Permits and final inspection handled',
    text: 'We pull the permit, prepare HOA paperwork when needed, and meet the city inspector for sign-off.',
  },
];

// TODO verify: "non-prorated" wording against the exact Owens Corning warranty tier registered per job.
const RING = '50-year system warranty ✦ Non-prorated ✦ 100% transferable ✦ CA Lic #1096492 ✦ ';

export function Standard() {
  return (
    <section id="standard" className="section standard" data-tone="dark" aria-labelledby="standard-h">
      <div className="wrap standard__grid">
        <div className="standard__copy">
          <header className="std__head">
            <h2 id="standard-h" className="h2">
              The Rise Up standard
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: '14px' }}>
              <a className="tlink" href="/about/roof-tear-off-process">
                See our 6-step tear-off process
              </a>
              <a className="tlink" href="/about">
                About our crew
              </a>
            </div>
          </header>
          <ul className="claims">
            {CLAIMS.map((c) => (
              <li key={c.title} className="claim">
                <h3 className="claim__title">{c.title}</h3>
                <p className="claim__text">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <figure className="standard__photo photo">
          {/* TODO: placeholder (2.0 crew photo, 640px). Replace with a real crew photo, portrait ≥1200×1600. */}
          <picture>
            <source type="image/avif" srcSet="/img/standard/craft.avif" />
            <img src="/img/standard/craft.webp" alt="Rise Up roofer setting clay tile over new underlayment" width={960} height={630} loading="lazy" decoding="async" data-parallax="photo" />
          </picture>
          <figcaption>Master craftsmanship, one tile at a time.</figcaption>
        </figure>
      </div>

      <div className="wrap warranty">
        <div className="seal" aria-hidden="true">
          <svg className="seal__ring" data-seal viewBox="0 0 200 200">
            <defs>
              <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text>
              <textPath href="#seal-circle" textLength="488" lengthAdjust="spacing">
                {RING}
              </textPath>
            </text>
          </svg>
          <div className="seal__core">
            <span className="seal__num">50</span>
            <span className="seal__unit">year</span>
          </div>
        </div>
        <div className="warranty__copy">
          <p className="warranty__line">50-year, non-prorated, 100% transferable.</p>
          <p className="warranty__text">
            Sell the house and the coverage goes with it. Buyers and their inspectors ask about this in escrow, and
            you will have the registration paperwork to hand them.
          </p>
        </div>
      </div>

      <ul className="wrap creds" aria-label="Credentials">
        {credentials.map((c) => (
          <li key={c.id} className="cred">
            {c.logo ? (
              <img src={c.logo} alt="" width={c.w} height={c.h} loading="lazy" className="cred__logo" />
            ) : (
              <span className="cred__logo cred__logo--text" aria-hidden="true">
                SD
              </span>
            )}
            <span className="cred__name">{c.name}</span>
            <span className="cred__detail">{c.detail}</span>
            <a className="tlink cred__verify" href={c.href} target="_blank" rel="noopener">
              Verify<span className="sr-only"> {c.name} (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="sr-only">License {company.licenseLabel}</p>
    </section>
  );
}
