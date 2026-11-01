import { BRAND_DATA } from '@/lib/brand-data';
import { company } from '@/lib/content';

export function TrustStrip() {
  return (
    <section id="trust" className="trust" data-tone="light" aria-labelledby="trust-h">
      <h2 id="trust-h" className="sr-only">
        Licenses, certification and insurance
      </h2>
      <ul className="trust__row wrap">
        <li className="trust__item">
          <a className="trust__link" href={company.urls.cslb} target="_blank" rel="noopener">
            <img src={BRAND_DATA.cslb} alt="California Contractors State License Board" width="44" height="44" loading="lazy" />
            <span>
              <span className="trust__title">CA Lic #{company.license}</span>
              <span className="trust__sub">Class B & C-39, active</span>
            </span>
          </a>
        </li>
        <li className="trust__item">
          <a className="trust__link" href={company.urls.oc} target="_blank" rel="noopener">
            <img src={BRAND_DATA.ocSeal} alt="Owens Corning Preferred Contractor seal" width="44" height="44" loading="lazy" />
            <span>
              <span className="trust__title">Owens Corning Preferred</span>
              <span className="trust__sub">Contractor ID #{company.ocId}</span>
            </span>
          </a>
        </li>
        <li className="trust__item">
          {/* TODO verify: $2M+ coverage from the old site. Link to the certificate of insurance once hosted. */}
          <span className="trust__link">
            <span className="trust__mark" aria-hidden="true">
              $2M
            </span>
            <span>
              <span className="trust__title">$2M+ insured</span>
              <span className="trust__sub">Liability & workers&rsquo; comp</span>
            </span>
          </span>
        </li>
        <li className="trust__item">
          <a className="trust__link" href={company.urls.chamber} target="_blank" rel="noopener">
            <img src={BRAND_DATA.chamber} alt="Escondido Chamber of Commerce" width="51" height="44" loading="lazy" />
            <span>
              <span className="trust__title">SD & Escondido Chamber</span>
              <span className="trust__sub">Member business</span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}
