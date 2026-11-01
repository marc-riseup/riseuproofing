import { company, faqs } from '@/lib/content';
import { LeadForm } from './LeadForm';

export function FinalCta() {
  return (
    <section id="estimate" className="section final" data-tone="dark" aria-labelledby="final-h">
      <span id="inspect" className="final__alias" aria-hidden="true" />
      <div className="wrap final__grid">
        <div className="final__copy">
          <h2 id="final-h" className="h2">
            Ready to protect your home with master craftsmanship?
          </h2>
          <p className="lead">
            Tell us three things and get a price range now. A licensed roofer calls to book your free 21-point
            inspection, or call us yourself at{' '}
            <a className="tel" href={company.phoneHref}>
              {company.phone}
            </a>
            .
          </p>
        </div>
        <LeadForm />
      </div>

      <div id="faq" className="wrap faq">
        <h3 className="faq__h">Questions we hear every week</h3>
        <div className="faq__list">
          {faqs.map((f) => (
            <details key={f.q} className="faq__item">
              <summary className="faq__q">
                <span>{f.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__a">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
