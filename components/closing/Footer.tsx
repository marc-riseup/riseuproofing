import { company, footerCapabilities, footerCompany, footerRegions } from '@/lib/content';

export function Footer() {
  return (
    <>
      <section id="careers" className="careers" data-tone="dark" aria-labelledby="careers-h">
        <div className="wrap careers__row">
          <h2 id="careers-h" className="careers__h">
            Roofers, carpenters, project managers: we are hiring.
          </h2>
          <p className="careers__text">Full-time, year-round San Diego work with an in-house crew.</p>
          <a className="tlink" href="/careers">
            See open roles
          </a>
        </div>
      </section>

      <footer className="footer" data-tone="dark">
        <div className="wrap footer__top">
          <div className="footer__brand">
            <img src="/img/brand/logo-dark-bg.svg" alt="Rise Up Roofing & Construction" width="190" height="46" loading="lazy" />
            <p className="footer__about">
              Roofing and general construction across San Diego County. Owens Corning Preferred Contractor.
            </p>
            <p className="footer__license">{company.licenseLabel}</p>
            <address className="footer__contact">
              <a href={company.phoneHref} className="footer__tel">
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <span>
                {company.street}, {company.city}, {company.region} {company.zip}
              </span>
            </address>
          </div>

          <nav className="footer__col" aria-labelledby="f-cap">
            <h2 id="f-cap" className="footer__h">
              Capabilities
            </h2>
            <ul>
              {footerCapabilities.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-labelledby="f-co">
            <h2 id="f-co" className="footer__h">
              Company
            </h2>
            <ul>
              {footerCompany.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <nav className="wrap footer__areas" aria-labelledby="f-areas">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px 16px' }}>
            <h2 id="f-areas" className="footer__h">
              San Diego County coverage, 32 cities
            </h2>
            <a className="tlink" href="/service-area">
              View all service areas
            </a>
          </div>
          <div className="footer__regions">
            {footerRegions.map((r) => (
              <div key={r.region} className="footer__region">
                <h3 className="footer__region-h">{r.region}</h3>
                <ul>
                  {r.cities.map((c) => (
                    <li key={c.href}>
                      <a href={c.href}>{c.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="footer__ghost" aria-hidden="true">
          <span data-ghost>RISE UP ROOFING</span>
        </div>

        <div className="wrap footer__legal">
          <p>© 2026 {company.legalName} {company.licenseLabel}.</p>
          <ul>
            <li>
              <a href="/privacy">Privacy</a>
            </li>
            <li>
              <a href="/terms">Terms</a>
            </li>
            <li>
              <a href="/contact">Support</a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
