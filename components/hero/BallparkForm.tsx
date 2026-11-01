'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ballparkServices, company, homeSizes } from '@/lib/content';
import { checkZip } from '@/lib/zip';
import {
  computeBallparkRange,
  type CrmPricingRule,
  fetchEstimatorConfig,
  getBallpark,
  submitLead,
  usd,
} from '@/lib/ballpark';
import { Icon, SubmitButton } from '@/components/ui/Icon';
import { IconDropdown } from '@/components/ui/IconDropdown';
import { Turnstile } from '@/components/shared/Turnstile';

type ServiceId = (typeof ballparkServices)[number]['value'];
type HomeSizeId = (typeof homeSizes)[number]['value'];

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^1(\d{10})$/, '$1').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function BallparkForm() {
  const id = useId();
  const [service, setService] = useState<ServiceId | ''>('');
  const [size, setSize] = useState<HomeSizeId | ''>('');
  const [zip, setZip] = useState('');
  const [step, setStep] = useState<'bar' | 'open' | 'done'>('bar');
  const [crmPricing, setCrmPricing] = useState<Record<string, CrmPricingRule>>({});

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formStartedAt, setFormStartedAt] = useState<number>(0);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormStartedAt(Date.now());
    void fetchEstimatorConfig().then(setCrmPricing);
  }, []);

  useEffect(() => {
    const onPreselect = (e: Event) => {
      const detail = (e as CustomEvent<{ service?: ServiceId }>).detail;
      if (!detail?.service) return;
      setService(detail.service);
      setErrors((p) => ({ ...p, service: false }));
      setStep((s) => (s === 'done' ? 'bar' : s));
      const el = document.getElementById('ballpark');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('is-highlighted');
        window.setTimeout(() => el.classList.remove('is-highlighted'), 1100);
      }
    };
    window.addEventListener('riseup:ballpark', onPreselect);
    return () => window.removeEventListener('riseup:ballpark', onPreselect);
  }, []);

  const zipRes = checkZip(zip);
  const city = zipRes.state === 'served' ? zipRes.city : null;
  const zipReady = zip.length === 5;
  const barReady = Boolean(service && size && zipReady);
  const svc: ServiceId = service || 'replacement';
  const sz: HomeSizeId = size || '1500-2500';
  const [low, high, monthly] = computeBallparkRange(svc, sz, crmPricing);

  const [dispRange, setDispRange] = useState<[number, number, number]>([low, high, monthly]);
  const prevRangeRef = useRef<[number, number, number]>([low, high, monthly]);

  useEffect(() => {
    if (step !== 'open') {
      prevRangeRef.current = [low, high, monthly];
      setDispRange([low, high, monthly]);
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      prevRangeRef.current = [low, high, monthly];
      setDispRange([low, high, monthly]);
      return;
    }
    const [fromLow, fromHigh, fromMo] = prevRangeRef.current;
    const t0 = performance.now();
    const dur = 480;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      const curLow = Math.round(fromLow + (low - fromLow) * ease);
      const curHigh = Math.round(fromHigh + (high - fromHigh) * ease);
      const curMo = Math.round(fromMo + (monthly - fromMo) * ease);
      setDispRange([curLow, curHigh, curMo]);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRangeRef.current = [low, high, monthly];
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [low, high, monthly, step]);

  const onBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, boolean> = {
      service: !service,
      size: !size,
      zip: !zipReady,
    };
    setErrors(next);
    if (next.service || next.size || next.zip) return;
    void getBallpark({ service: svc, size: sz, zip });
    setStep('open');
    window.setTimeout(() => nameRef.current?.focus(), 60);
  };

  const onLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    const next: Record<string, boolean> = {
      name: name.trim().length < 2,
      phone: !(digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))),
      email: Boolean(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
    };
    setErrors(next);
    if (next.name || next.phone || next.email) return;

    setSubmitState('loading');
    try {
      await submitLead({
        service: svc,
        size: sz,
        zip,
        city,
        name,
        phone,
        email,
        low,
        high,
        monthly,
        formType: 'estimator_full',
        leadSource: 'website_estimator',
        leadSourceDetail: '📊 Instant Estimator',
        honeypotWebsite: hp,
        formStartedAt,
        turnstileToken,
      });
    } catch {
      // still confirm so the homeowner is never stranded
    }
    setSubmitState('done');
    window.setTimeout(() => {
      setStep('done');
      window.setTimeout(() => doneRef.current?.focus(), 40);
    }, 320);
  };

  if (step === 'done') {
    const first = name.trim().split(/\s+/)[0] || 'there';
    const svcLabel = ballparkServices.find((o) => o.value === svc)?.label ?? svc;
    const szLabel = homeSizes.find((o) => o.value === sz)?.label ?? sz;
    return (
      <div id="ballpark" ref={doneRef} tabIndex={-1} className="bbar bbar--done est" data-state="success" role="status" aria-live="polite">
        <span className="est__bg glass" aria-hidden="true" />
        <div className="est__success-well">
          <span className="est__check" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <p className="bbar__done-title est__success-title">You&rsquo;re all set, {first}.</p>
          <p className="bbar__done-sub est__recap">
            {svcLabel} · {szLabel} · ZIP {zip} · Est. {usd(low)} to {usd(high)}
          </p>
          <p className="bbar__done-call est__talk">
            We&rsquo;ll text or call within 15 minutes during business hours. Need us sooner? Call{' '}
            <a className="tel" href={company.phoneHref}>
              {company.phone}
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="ballpark" className="bbar est" data-state={step === 'open' ? 'expanded' : 'bar'}>
      {/* Single sibling glass backdrop layer (2.0 architecture) */}
      <span className="est__bg glass" aria-hidden="true" />

      <div className="bbar__head est__head">
        <div className="est__head-scrim">
          <h2 id={`${id}-h`} className="bbar__title est__title">
            Get your ballpark in 10 seconds
          </h2>
          <span className="est__head-dot" aria-hidden="true">
            ·
          </span>
          <p className="bbar__sub est__sub">Free inspection · No obligation · No spam</p>
          {zipReady && city && (
            <p className="est__zip-verified" role="status" aria-live="polite">
              <span className="est__zip-verified-dot" aria-hidden="true" />
              <span>Yes, we serve {city}</span>
            </p>
          )}
        </div>
      </div>

      {/* Continuous horizontal instrument bar (Riseup 2.0 .est__bar) */}
      <form className="bbar__row est__bar" aria-labelledby={`${id}-h`} noValidate onSubmit={onBarSubmit}>
        {/* 1. Service cell */}
        <IconDropdown
          id={`${id}-svc`}
          label="Service"
          placeholder="Select service"
          defaultIcon="house"
          value={service}
          options={ballparkServices}
          invalid={errors.service}
          cellClassName="field est__cell est__cell--service"
          variant="bar"
          onChange={(val) => {
            setService(val);
            setErrors((p) => ({ ...p, service: false }));
          }}
        />

        <span className="est__sep" aria-hidden="true" />

        {/* 2. Home size cell */}
        <IconDropdown
          id={`${id}-sz`}
          label="Home size"
          placeholder="Select size"
          defaultIcon="ruler"
          value={size}
          options={homeSizes}
          invalid={errors.size}
          cellClassName="field est__cell est__cell--size"
          variant="bar"
          onChange={(val) => {
            setSize(val);
            setErrors((p) => ({ ...p, size: false }));
          }}
        />

        <span className="est__sep" aria-hidden="true" />

        {/* 3. ZIP code cell */}
        <div className={`field est__cell est__cell--zip ${errors.zip ? 'is-missing' : ''}`}>
          <label className="est__zip-wrap" htmlFor={`${id}-zip`}>
            <span className="est__chip" aria-hidden="true">
              <svg className="ico" viewBox="0 0 24 24">
                <path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <span className="est__meta">
              <span className="field__label est__label">ZIP code</span>
              <input
                id={`${id}-zip`}
                className="input est__input"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="92101"
                maxLength={5}
                value={zip}
                aria-invalid={errors.zip || undefined}
                aria-describedby={`${id}-zipnote`}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
                  setErrors((p) => ({ ...p, zip: false }));
                }}
              />
            </span>
          </label>
        </div>

        {/* 4. Get My Ballpark CTA */}
        <div className="est__cell est__cell--cta">
          <button
            type="submit"
            className={`btn btn--primary bbar__btn est__cta ${barReady ? '' : 'is-incomplete'}`}
          >
            <span className="est__pulse" aria-hidden="true" />
            <span>Get My Ballpark</span>
            <Icon name="arrow" className="btn__arrow" />
          </button>
        </div>
      </form>

      <p
        id={`${id}-zipnote`}
        className="zipnote bbar__zipnote"
        data-state={zipReady && city ? 'served' : undefined}
        aria-live="polite"
      >
        {zipReady ? (city ? `Serving ${city}, San Diego County.` : 'Outside our usual area — leave your info and we will confirm.') : '\u00a0'}
      </p>

      {/* Expandable Ballpark Result + Lead Capture Drawer */}
      <div className="bbar__drawer est__drawer" data-open={step === 'open' || undefined} inert={step !== 'open'}>
        <div className="bbar__drawer-in est__drawer-clip">
          <div className="est__stage">
            <div className="bbar__result">
              <div>
                <p className="bbar__eyebrow est__eyebrow">
                  Your estimated ballpark{city ? ` · ${city}` : ''}
                </p>
                <div className="est__price-row">
                  <p className="bbar__price est__price tabular-nums">
                    {usd(dispRange[0])} to {usd(dispRange[1])}
                  </p>
                  <span className="bbar__monthly est__monthly tabular-nums">
                    or as low as {usd(dispRange[2])}/mo
                  </span>
                </div>
                <p className="est__note">Final price confirmed at your free 21-point inspection.</p>
              </div>
            </div>

            <hr className="est__divider" aria-hidden="true" />

            <form className="bbar__lead est__lead-row" noValidate onSubmit={onLeadSubmit}>
              <label className={`field est__well ${errors.name ? 'is-invalid' : ''}`} htmlFor={`${id}-name`}>
                <span className="field__label est__label">Full name</span>
                <input
                  ref={nameRef}
                  id={`${id}-name`}
                  className="input est__input"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Rivera"
                  value={name}
                  aria-invalid={errors.name || undefined}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((p) => ({ ...p, name: false }));
                  }}
                />
              </label>

              <label className={`field est__well ${errors.phone ? 'is-invalid' : ''}`} htmlFor={`${id}-tel`}>
                <span className="field__label est__label">Phone</span>
                <input
                  id={`${id}-tel`}
                  className="input est__input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(760) 555-0192"
                  value={phone}
                  aria-invalid={errors.phone || undefined}
                  onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    setErrors((p) => ({ ...p, phone: false }));
                  }}
                />
              </label>

              <label className={`field est__well ${errors.email ? 'is-invalid' : ''}`} htmlFor={`${id}-mail`}>
                <span className="field__label est__label">Email (optional)</span>
                <input
                  id={`${id}-mail`}
                  className="input est__input"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@example.com"
                  value={email}
                  aria-invalid={errors.email || undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: false }));
                  }}
                />
              </label>

              <div className="sr-only" aria-hidden="true">
                <label htmlFor={`${id}-hp`}>Company website</label>
                <input id={`${id}-hp`} tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                <Turnstile onVerify={setTurnstileToken} />
              </div>

              <SubmitButton state={submitState} className="bbar__send est__send" red>
                Send My Quote
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
