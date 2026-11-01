'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ballparkServices, homeSizes, company } from '@/lib/content';
import { checkZip, zipMessage } from '@/lib/zip';
import { getBallpark, submitLead, usd } from '@/lib/ballpark';
import { SubmitButton } from '@/components/ui/Icon';
import { IconDropdown } from '@/components/ui/IconDropdown';
import { Turnstile } from '@/components/shared/Turnstile';

type ServiceId = (typeof ballparkServices)[number]['value'];
type HomeSizeId = (typeof homeSizes)[number]['value'];
type Intent = 'price' | 'inspection';

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^1(\d{10})$/, '$1').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Final form. Intent follows the CTA that brought the visitor here (#estimate vs #inspect). */
export function LeadForm() {
  const id = useId();
  const [intent, setIntent] = useState<Intent>('price');
  const [service, setService] = useState<ServiceId | ''>('');
  const [size, setSize] = useState<HomeSizeId | ''>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formStartedAt, setFormStartedAt] = useState<number>(0);
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [done, setDone] = useState<{ range?: string } | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormStartedAt(Date.now());
    const read = () => {
      if (location.hash === '#inspect') setIntent('inspection');
      if (location.hash === '#estimate') setIntent('price');
    };
    read();
    window.addEventListener('hashchange', read);
    // Lenis intercepts anchor clicks (no hashchange), so read intent from the click too.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href="#inspect"], a[href="#estimate"]');
      if (a) setIntent(a.getAttribute('href') === '#inspect' ? 'inspection' : 'price');
    };
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('hashchange', read);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  const check = checkZip(zip);
  const nameOk = name.trim().length >= 2;
  const digits = phone.replace(/\D/g, '');
  const phoneOk = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!service || !size || !nameOk || !phoneOk || check.state !== 'served' || !emailOk) {
      (e.currentTarget as HTMLFormElement).querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setState('loading');
    try {
      const input = { service, size, zip };
      const city = check.state === 'served' ? check.city : null;
      const range = await getBallpark(input);
      await submitLead({
        ...input,
        city,
        name,
        phone,
        email,
        low: range.low,
        high: range.high,
        monthly: range.monthly,
        formType: 'estimate',
        leadSource: intent === 'inspection' ? 'website_inspection' : 'website_estimate',
        leadSourceDetail: intent === 'inspection' ? '🛡️ 21-Point Roof Inspection' : 'Website Free Estimate',
        honeypotWebsite: hp,
        formStartedAt,
        turnstileToken,
      });
      setState('done');
      window.setTimeout(
        () => setDone({ range: intent === 'price' ? `${usd(range.low)}–${usd(range.high)}` : undefined }),
        450,
      );
    } catch {
      setState('done');
      window.setTimeout(() => setDone({}), 450);
    }
  }

  if (done) {
    return (
      <div ref={successRef} className="lead lead--done" tabIndex={-1} role="status">
        <p className="lead__done-title">Got it. A licensed roofer will call you {company.responseTime}.</p>
        {done.range && (
          <p className="lead__done-range">
            Your ballpark: <strong>{done.range}</strong>. We will firm it up at the free inspection.
          </p>
        )}
        <p className="lead__done-alt">
          Can&rsquo;t wait?{' '}
          <a className="tel" href={company.phoneHref}>
            Call {company.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      id="final-form"
      className="lead"
      onSubmit={onSubmit}
      noValidate
      aria-label={intent === 'price' ? 'Get my ballpark' : 'Book a free inspection'}
    >
      <div className="lead__grid">
        <IconDropdown
          id={`${id}-s`}
          label="Service"
          placeholder="Choose a service"
          defaultIcon="house"
          value={service}
          options={ballparkServices}
          invalid={touched && !service}
          cellClassName="field lead__field-dd"
          variant="field"
          onChange={(val) => setService(val)}
        />
        <IconDropdown
          id={`${id}-h`}
          label="Home size"
          placeholder="Choose a size"
          defaultIcon="ruler"
          value={size}
          options={homeSizes}
          invalid={touched && !size}
          cellClassName="field lead__field-dd"
          variant="field"
          onChange={(val) => setSize(val)}
        />
        <div className="field">
          <label className="field__label" htmlFor={`${id}-n`}>
            Full name
          </label>
          <input
            id={`${id}-n`}
            className="input"
            type="text"
            autoComplete="name"
            placeholder="Alex Rivera"
            required
            value={name}
            aria-invalid={touched && !nameOk ? true : undefined}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${id}-p`}>
            Phone, so we can call you back
          </label>
          <input
            id={`${id}-p`}
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(760) 555-0134"
            required
            value={phone}
            aria-invalid={touched && !phoneOk ? true : undefined}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${id}-z`}>
            ZIP code
          </label>
          <input
            id={`${id}-z`}
            className="input"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="92054"
            required
            value={zip}
            aria-invalid={touched && check.state !== 'served' ? true : undefined}
            aria-describedby={`${id}-zn`}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${id}-e`}>
            Email (optional)
          </label>
          <input
            id={`${id}-e`}
            className="input"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            value={email}
            aria-invalid={touched && !emailOk ? true : undefined}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${id}-hp`}>Company website</label>
        <input id={`${id}-hp`} tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        <Turnstile onVerify={setTurnstileToken} />
      </div>
      <p id={`${id}-zn`} className="zipnote" data-state={check.state} aria-live="polite">
        {zipMessage(check)}
      </p>
      <div className="lead__submit">
        <SubmitButton state={state}>{intent === 'price' ? 'Get My Ballpark' : 'Book Free Inspection'}</SubmitButton>
        <p className="lead__fine">No obligation. We never sell your number.</p>
      </div>
    </form>
  );
}
