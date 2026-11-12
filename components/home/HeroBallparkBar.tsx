'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { PHONE_HREF, PHONE_NUMBER } from '@/lib/utils';
import { checkZip, zipMessage } from '@/lib/zip';
import {
  BALLPARK_SERVICES,
  HOME_SIZES,
  type BallparkServiceId,
  type HomeSizeId,
  type CrmPricingRule,
  computeBallparkRange,
  fetchEstimatorConfig,
  formatPhone,
  isValidEmail,
  isValidUsPhone,
  submitLead,
  usd,
} from '@/lib/ballpark';
import { HeroDropdown } from './HeroDropdown';
import { Turnstile } from '@/components/shared/Turnstile';

const SERVICE_ALIASES: Record<string, BallparkServiceId> = {
  replacement: 'replacement',
  residential: 'replacement',
  'residential-roofing': 'replacement',
  'metal-roofing': 'replacement',
  'tile-relay': 'tile-relay',
  'tile-roofing': 'tile-relay',
  repair: 'repair',
  'roof-repair': 'repair',
  'roof-inspection': 'repair',
  flat: 'flat',
  commercial: 'flat',
  'commercial-roofing': 'flat',
  'roof-coating': 'flat',
  solar: 'solar',
  'solar-roofing': 'solar',
  construction: 'construction',
  'deck-builder': 'construction',
  siding: 'construction',
  'adu-construction': 'construction',
};

export function HeroBallparkBar() {
  const id = useId();
  const [service, setService] = useState<BallparkServiceId | ''>('');
  const [size, setSize] = useState<HomeSizeId | ''>('');
  const [zip, setZip] = useState('');
  const [step, setStep] = useState<'bar' | 'open' | 'done'>('bar');
  const [crmPricing, setCrmPricing] = useState<Record<string, CrmPricingRule>>({});

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactTouched, setContactTouched] = useState(false);
  const [honeypotFax, setHoneypotFax] = useState('');
  const [honeypotWebsite, setHoneypotWebsite] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [submitState, setSubmitState] = useState<'idle' | 'loading'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [barFeedback, setBarFeedback] = useState<string | null>(null);

  const formStartedAtRef = useRef<number>(0);
  const configLoadedRef = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);

  const warmEstimatorConfig = () => {
    if (configLoadedRef.current) return;
    configLoadedRef.current = true;
    void fetchEstimatorConfig().then(setCrmPricing);
  };

  useEffect(() => {
    formStartedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    const onPreselect = (e: Event) => {
      const rawService = (e as CustomEvent<{ service?: string }>).detail?.service;
      if (!rawService) return;
      const mapped = SERVICE_ALIASES[rawService];
      if (!mapped) return;
      setService(mapped);
      warmEstimatorConfig();
      setErrors((p) => ({ ...p, service: false }));
      setBarFeedback(null);
      setStep((s) => (s === 'done' ? 'bar' : s));
      const el = document.getElementById('hero-estimator');
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
  const isServed = zipRes.state === 'served';
  const city = isServed ? zipRes.city : null;
  const barReady = Boolean(service && size && isServed);
  const svc: BallparkServiceId = service || 'replacement';
  const sz: HomeSizeId = size || '1500-2500';
  const [low, high, monthly] = computeBallparkRange(svc, sz, crmPricing);

  const [dispRange, setDispRange] = useState<[number, number, number]>([low, high, monthly]);
  const prevRangeRef = useRef<[number, number, number]>([low, high, monthly]);

  useEffect(() => {
    if (step !== 'open') {
      prevRangeRef.current = [low, high, monthly];
      return;
    }
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [fromLow, fromHigh, fromMo] = prevRangeRef.current;
    const t0 = performance.now();
    const dur = reducedMotion ? 0 : 420;
    let raf = 0;
    const tick = (now: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
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
      zip: !isServed,
    };
    setErrors(next);
    if (next.service || next.size || next.zip) {
      if (!next.service && !next.size && zipRes.state === 'outside') {
        setBarFeedback(zipMessage(zipRes));
        return;
      }
      const missing: string[] = [];
      if (next.service) missing.push('a service');
      if (next.size) missing.push('your home size');
      if (next.zip) {
        missing.push(
          zipRes.state === 'outside'
            ? 'a San Diego County, Temecula, or Murrieta ZIP code'
            : 'a valid 5-digit California ZIP code',
        );
      }
      setBarFeedback(
        zipRes.state === 'outside'
          ? `${zipMessage(zipRes)} Select ${missing.join(' and ')} for an online ballpark.`
          : `Select ${missing.join(', ')} to see your instant ballpark.`,
      );
      return;
    }
    setBarFeedback(null);
    setStep('open');
    window.setTimeout(() => nameRef.current?.focus(), 60);
  };

  const onLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setSubmitError(null);

    if (!isServed) {
      setStep('bar');
      setErrors((prev) => ({ ...prev, zip: true }));
      setBarFeedback(zipMessage(zipRes) || 'Enter a valid 5-digit San Diego County ZIP code.');
      return;
    }

    const next: Record<string, boolean> = {
      name: name.trim().length < 2,
      phone: !isValidUsPhone(phone),
      email: Boolean(email.trim()) && !isValidEmail(email),
    };
    setErrors((prev) => ({ ...prev, ...next }));
    if (next.name || next.phone || next.email) {
      const msgs: string[] = [];
      if (next.name) msgs.push('your full name');
      if (next.phone) msgs.push('a valid 10-digit US phone number');
      if (next.email) msgs.push('a valid email address');
      setSubmitError(`Please enter ${msgs.join(' and ')} so we can send your itemized quote.`);
      return;
    }

    submittingRef.current = true;
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
        leadSourceDetail: 'Hero Ballpark Estimator',
        honeypotFax,
        honeypotWebsite,
        formStartedAt: formStartedAtRef.current,
        turnstileToken,
      });
      setStep('done');
      window.setTimeout(() => doneRef.current?.focus(), 40);
    } catch (err: unknown) {
      setTurnstileToken('');
      setTurnstileKey((k) => k + 1);
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : 'We could not submit your quote right now. Please retry or call our Oceanside desk.',
      );
    } finally {
      submittingRef.current = false;
      setSubmitState('idle');
    }
  };

  const svcLabel = BALLPARK_SERVICES.find((o) => o.value === svc)?.label ?? 'Roofing Project';
  const szLabel = HOME_SIZES.find((o) => o.value === sz)?.label ?? sz;

  if (step === 'done') {
    const first = name.trim().split(/\s+/)[0] || 'there';
    return (
      <div id="hero-estimator" className="scroll-mt-28">
        <div
          id="ballpark"
          ref={doneRef}
          tabIndex={-1}
          className="bbar bbar--done est"
          data-state="success"
          role="status"
          aria-live="polite"
        >
          <span className="est__bg hero-glass" aria-hidden="true" />
          <div className="est__success-well">
            <span className="est__check" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <p className="est__success-title">You&rsquo;re all set, {first}.</p>
            <p className="est__recap tabular-nums">
              {svcLabel} · {szLabel} · ZIP {zip} · Est. {usd(low)} to {usd(high)}
            </p>
            <p className="est__talk">
              Edith, Luis, or our Oceanside estimator will text or call within 15 minutes during
              business hours. Need immediate dispatch? Call{' '}
              <a className="est__tel-link" href={PHONE_HREF}>
                {PHONE_NUMBER}
              </a>
              .
            </p>
            <button
              type="button"
              className="est__reset-btn"
              onClick={() => {
                setSubmitError(null);
                setTurnstileToken('');
                setTurnstileKey((k) => k + 1);
                setStep('open');
              }}
            >
              Adjust project options
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="hero-estimator"
      className="est-anchor scroll-mt-28"
      onPointerEnter={warmEstimatorConfig}
      onFocusCapture={warmEstimatorConfig}
    >
      <div id="ballpark" className="bbar est" data-state={step === 'open' ? 'expanded' : 'bar'}>
        <span className="est__bg hero-glass" aria-hidden="true" />

        <div className="est__head">
          <div className="est__head-scrim">
            <h2 id={`${id}-h`} className="est__title">
              Get your ballpark in 10 seconds
            </h2>
            <span className="est__head-dot" aria-hidden="true">
              ·
            </span>
            <p className="est__sub">Free inspection · No obligation · No spam</p>
            {isServed && (
              <p className="est__zip-verified" role="status" aria-live="polite">
                <span className="est__zip-verified-dot" aria-hidden="true" />
                <span>Yes, we serve {city ?? 'San Diego County'}</span>
              </p>
            )}
          </div>
        </div>

        <form className="est__bar" aria-labelledby={`${id}-h`} noValidate onSubmit={onBarSubmit}>
          <HeroDropdown
            id={`${id}-svc`}
            label="Service"
            placeholder="Select service"
            defaultIcon="house"
            value={service}
            options={BALLPARK_SERVICES}
            invalid={errors.service}
            cellClassName="field est__cell est__cell--service"
            variant="bar"
            onChange={(val) => {
              setService(val);
              setErrors((p) => ({ ...p, service: false }));
              setBarFeedback(null);
            }}
          />

          <span className="est__sep" aria-hidden="true" />

          <HeroDropdown
            id={`${id}-sz`}
            label="Home size"
            placeholder="Select size"
            defaultIcon="ruler"
            value={size}
            options={HOME_SIZES}
            invalid={errors.size}
            cellClassName="field est__cell est__cell--size"
            variant="bar"
            onChange={(val) => {
              setSize(val);
              setErrors((p) => ({ ...p, size: false }));
              setBarFeedback(null);
            }}
          />

          <span className="est__sep" aria-hidden="true" />

          <div className={`field est__cell est__cell--zip ${errors.zip ? 'is-missing' : ''}`}>
            <label className="est__zip-wrap" htmlFor={`${id}-zip`}>
              <span className={`est__chip ${isServed ? 'is-selected' : ''}`} aria-hidden="true">
                <svg className="ico" viewBox="0 0 24 24">
                  <path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span className="est__meta">
                <span className="field__label est__label">ZIP code</span>
                <input
                  id={`${id}-zip`}
                  className="input est__input tabular-nums"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="92054"
                  maxLength={10}
                  value={zip}
                  aria-invalid={
                    errors.zip ||
                    zipRes.state === 'invalid' ||
                    zipRes.state === 'outside' ||
                    undefined
                  }
                  aria-describedby={`${id}-zipnote`}
                  onChange={(e) => {
                    const nextZip = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setZip(nextZip);
                    setErrors((p) => ({ ...p, zip: false }));
                    setBarFeedback(null);
                    if (checkZip(nextZip).state !== 'served') {
                      setStep((s) => (s === 'open' ? 'bar' : s));
                    }
                  }}
                />
              </span>
            </label>
          </div>

          <div className="est__cell est__cell--cta">
            <button
              type="submit"
              className={`hero-btn hero-btn--primary est__cta ${barReady ? '' : 'is-incomplete'}`}
            >
              <span className="est__pulse" aria-hidden="true" />
              <span>Get My Ballpark</span>
              <svg className="hero-btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </form>

        <p
          id={`${id}-zipnote`}
          className="zipnote bbar__zipnote"
          data-state={
            barFeedback
              ? 'error'
              : isServed
                ? 'served'
                : zipRes.state === 'invalid' || zipRes.state === 'outside'
                  ? 'error'
                  : undefined
          }
          aria-live="polite"
        >
          {barFeedback ||
            (zip.length === 5
              ? isServed
                ? `Serving ${city ? `${city}, CA` : 'San Diego County'} (${zip}).`
                : zipMessage(zipRes)
              : '\u00a0')}
        </p>

        <div
          className="bbar__drawer est__drawer"
          data-open={step === 'open' || undefined}
          inert={step !== 'open'}
        >
          <div className="bbar__drawer-in est__drawer-clip">
            {step === 'open' && (
            <div className="est__stage">
              <div className="bbar__result">
                <p className="est__result-meta">
                  Estimated ballpark for {svcLabel}
                  {city ? ` · ${city}` : ''}
                </p>
                <div className="est__price-row">
                  <p className="est__price tabular-nums">
                    {usd(dispRange[0])} to {usd(dispRange[1])}
                  </p>
                  <Link prefetch={false}
                    href="/roof-financing-san-diego"
                    className="est__monthly tabular-nums"
                  >
                    <span>or as low as {usd(dispRange[2])}/mo</span>
                    <svg
                      className="est__monthly-arrow"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M4 12h15m-6-6 6 6-6 6" />
                    </svg>
                  </Link>
                </div>
                <p className="est__note">
                  Includes tear-off, coastal underlayment &amp; cleanup. Final itemized quote
                  confirmed at your free 21-point inspection.
                </p>
              </div>

              <hr className="est__divider" aria-hidden="true" />

              <form noValidate onSubmit={onLeadSubmit}>
                {submitError && (
                  <div role="alert" className="est__error">
                    <div className="est__error-copy">
                      <p className="est__error-title">Could not send your quote request</p>
                      <p className="est__error-msg">
                        {submitError}{' '}
                        <a href={PHONE_HREF} className="est__tel-link">
                          Call {PHONE_NUMBER}
                        </a>
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={submitState === 'loading'}
                      className="est__retry-btn"
                    >
                      Retry
                    </button>
                  </div>
                )}

                <div className="est__lead-row">
                  <label
                    className={`field est__well ${errors.name ? 'is-invalid' : ''}`}
                    htmlFor={`${id}-name`}
                  >
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
                      onPointerDown={() => setContactTouched(true)}
                      onKeyDown={() => setContactTouched(true)}
                      onChange={(e) => {
                        setContactTouched(true);
                        setName(e.target.value);
                        setErrors((p) => ({ ...p, name: false }));
                        if (submitError) setSubmitError(null);
                      }}
                    />
                  </label>

                  <label
                    className={`field est__well ${errors.phone ? 'is-invalid' : ''}`}
                    htmlFor={`${id}-tel`}
                  >
                    <span className="field__label est__label">Phone</span>
                    <input
                      id={`${id}-tel`}
                      className="input est__input tabular-nums"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(760) 555-0192"
                      value={phone}
                      aria-invalid={errors.phone || undefined}
                      onPointerDown={() => setContactTouched(true)}
                      onKeyDown={() => setContactTouched(true)}
                      onChange={(e) => {
                        setContactTouched(true);
                        setPhone(formatPhone(e.target.value));
                        setErrors((p) => ({ ...p, phone: false }));
                        if (submitError) setSubmitError(null);
                      }}
                    />
                  </label>

                  <label
                    className={`field est__well ${errors.email ? 'is-invalid' : ''}`}
                    htmlFor={`${id}-mail`}
                  >
                    <span className="field__label est__label">Email (optional)</span>
                    <input
                      id={`${id}-mail`}
                      className="input est__input"
                      type="email"
                      autoComplete="email"
                      placeholder="alex@example.com"
                      value={email}
                      aria-invalid={errors.email || undefined}
                      onPointerDown={() => setContactTouched(true)}
                      onKeyDown={() => setContactTouched(true)}
                      onChange={(e) => {
                        setContactTouched(true);
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: false }));
                        if (submitError) setSubmitError(null);
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    className="hero-btn hero-btn--primary est__send"
                    data-state={submitState}
                    aria-busy={submitState === 'loading'}
                    disabled={submitState === 'loading'}
                  >
                    <span className="hero-btn__label">
                      {submitState === 'loading' ? 'Sending...' : 'Send My Quote'}
                    </span>
                    {submitState === 'loading' && (
                      <span className="hero-btn__spin" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Anti-spam honeypots */}
                <div className="est__hp" aria-hidden="true">
                  <label htmlFor={`${id}-fax`}>Business fax</label>
                  <input
                    id={`${id}-fax`}
                    name="business_fax"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypotFax}
                    onChange={(e) => setHoneypotFax(e.target.value)}
                  />
                  <label htmlFor={`${id}-web`}>Company website</label>
                  <input
                    id={`${id}-web`}
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypotWebsite}
                    onChange={(e) => setHoneypotWebsite(e.target.value)}
                  />
                </div>

                {step === 'open' &&
                  (contactTouched || Boolean(name.trim() || phone.trim() || email.trim())) && (
                    <Turnstile
                      key={turnstileKey}
                      onVerify={setTurnstileToken}
                      onExpire={() => setTurnstileToken('')}
                      onError={() => setTurnstileToken('')}
                      theme="light"
                      className="est__turnstile"
                    />
                  )}
              </form>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
