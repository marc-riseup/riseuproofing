'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { checkZip, zipMessage } from '@/lib/zip';
import {
  BALLPARK_SERVICES,
  HOME_SIZES,
  type BallparkServiceId,
  type HomeSizeId,
  fetchEstimatorConfig,
  formatPhone,
  getBallpark,
  isValidEmail,
  isValidUsPhone,
  submitLead,
  usd,
} from '@/lib/ballpark';
import { HeroDropdown } from '@/components/home/HeroDropdown';
import { Turnstile } from '@/components/shared/Turnstile';
import { Icon } from '@/components/shared/Icon';
import { clsx as cn } from 'clsx';
import { PHONE_HREF, PHONE_NUMBER } from '@/lib/utils';

type LeadIntent = 'price' | 'inspection';

interface DonePayload {
  low: number;
  high: number;
  monthly: number;
  city: string | null;
}

export function ClosingLeadForm() {
  const id = useId();
  const [intent, setIntent] = useState<LeadIntent>('price');
  const [service, setService] = useState<BallparkServiceId | ''>('');
  const [size, setSize] = useState<HomeSizeId | ''>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [honeypotFax, setHoneypotFax] = useState('');
  const [honeypotWebsite, setHoneypotWebsite] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  const [touched, setTouched] = useState(false);
  const [contactTouched, setContactTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<DonePayload | null>(null);

  const formStartedAtRef = useRef<number>(0);
  const configLoadedRef = useRef(false);
  const submittingRef = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);

  const warmEstimatorConfig = () => {
    if (configLoadedRef.current) return;
    configLoadedRef.current = true;
    void fetchEstimatorConfig();
  };

  useEffect(() => {
    formStartedAtRef.current = Date.now();

    const syncFromHash = () => {
      if (window.location.hash === '#inspect') {
        setIntent('inspection');
      } else if (window.location.hash === '#estimate') {
        setIntent('price');
      }
    };

    const initTimer = window.setTimeout(syncFromHash, 0);
    window.addEventListener('hashchange', syncFromHash);

    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href="#inspect"], a[href="#estimate"], [data-lead-intent]'
      );
      if (!anchor) return;
      const explicit = anchor.getAttribute('data-lead-intent');
      const href = anchor.getAttribute('href');
      if (explicit === 'inspection' || href === '#inspect') {
        setIntent('inspection');
      } else if (explicit === 'price' || href === '#estimate') {
        setIntent('price');
      }
    };

    document.addEventListener('click', onAnchorClick);
    return () => {
      window.clearTimeout(initTimer);
      window.removeEventListener('hashchange', syncFromHash);
      document.removeEventListener('click', onAnchorClick);
    };
  }, []);

  useEffect(() => {
    if (done) {
      doneRef.current?.focus();
    }
  }, [done]);

  const zipCheck = checkZip(zip);
  const zipStatusText = zipMessage(zipCheck);
  const nameOk = name.trim().length >= 2;
  const phoneOk = isValidUsPhone(phone);
  const zipOk = zipCheck.state === 'served';
  const emailOk = !email.trim() || isValidEmail(email);

  const missingFields: string[] = [];
  if (!service) missingFields.push('a service');
  if (!size) missingFields.push('your home size');
  if (!nameOk) missingFields.push('your full name');
  if (!phoneOk) missingFields.push('a valid 10-digit US phone number');
  if (!zipOk) {
    missingFields.push(
      zipCheck.state === 'outside'
        ? 'a San Diego County, Temecula, or Murrieta ZIP code'
        : 'a 5-digit ZIP code'
    );
  }
  if (!emailOk) missingFields.push('a valid email address');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    setTouched(true);
    setSubmitError(null);

    if (missingFields.length > 0) {
      const formEl = e.currentTarget;
      window.requestAnimationFrame(() => {
        formEl.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const city = zipCheck.state === 'served' ? zipCheck.city : null;
      const range = await getBallpark({ service, size, zip });

      await submitLead({
        service,
        size,
        zip,
        city,
        name,
        phone,
        email,
        low: range.low,
        high: range.high,
        monthly: range.monthly,
        formType: 'estimate',
        leadSource: intent === 'inspection' ? 'website_inspection' : 'website_estimate',
        leadSourceDetail:
          intent === 'inspection'
            ? '21-Point Roof Inspection Request'
            : 'Closing Written Estimate & Ballpark Form',
        honeypotFax,
        honeypotWebsite,
        formStartedAt: formStartedAtRef.current,
        turnstileToken,
      });

      setDone({
        low: range.low,
        high: range.high,
        monthly: range.monthly,
        city,
      });
    } catch (err: unknown) {
      setTurnstileToken('');
      setTurnstileKey((k) => k + 1);
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Unable to submit your request right now. Please retry or call (760) 622-1230.';
      setSubmitError(msg);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="bg-[#FFFFFF] text-[#0B1B2B] p-6 sm:p-8 lg:p-10 border border-white/20 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] focus:outline-none"
      >
        <div className="flex items-center gap-3 pb-5 border-b border-[#0B1B2B]/12">
          <Icon name="check-circle" className="w-7 h-7 text-[#15803D] shrink-0" />
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-[-0.02em] text-[#0B1B2B]">
              {intent === 'inspection'
                ? 'Inspection Request Confirmed'
                : 'Your San Diego Ballpark Is Ready'}
            </p>
            <p className="text-xs sm:text-sm text-[#233B53]">
              A licensed Rise Up estimator will call you within 15 minutes during business hours.
            </p>
          </div>
        </div>

        <div className="py-6 border-b border-[#0B1B2B]/12 tabular-nums">
          <p className="text-xs font-bold uppercase tracking-[0.05em] text-[#3E5871]">
            Estimated Ballpark Range{done.city ? ` · ${done.city}, CA` : ''}
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] text-[#0B1B2B]">
            {usd(done.low)} – {usd(done.high)}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-[#233B53]">
            Estimated monthly financing from <strong className="text-[#0B1B2B]">{usd(done.monthly)}/mo</strong> ($0 down options available · confirmed at your free 21-point inspection).
          </p>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 tabular-nums"
          >
            <Icon name="phone" className="w-4 h-4 text-[#C92D20]" />
            <span>Need immediate dispatch? Call {PHONE_NUMBER}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setDone(null);
              setTouched(false);
              setSubmitError(null);
              setTurnstileToken('');
              setTurnstileKey((k) => k + 1);
            }}
            className="text-xs font-bold text-[#3E5871] hover:text-[#0B1B2B] underline underline-offset-4 cursor-pointer text-left sm:text-right"
          >
            Calculate another project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onPointerEnter={warmEstimatorConfig}
      onFocusCapture={warmEstimatorConfig}
      className="bg-[#FFFFFF] text-[#0B1B2B] p-6 sm:p-8 lg:p-10 border border-white/20 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)]"
    >
      {/* 2-Option Segmented Intent Switch */}
      <div
        role="group"
        aria-label="Choose estimate or inspection request"
        className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-lg bg-[#EEF5FA] p-1.5 border border-[#0B1B2B]/12"
      >
        <button
          type="button"
          aria-pressed={intent === 'price'}
          onClick={() => setIntent('price')}
          className={cn(
            'min-h-11 rounded-md px-3.5 py-2.5 text-xs sm:text-sm font-extrabold tracking-[-0.01em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1B2B]',
            intent === 'price'
              ? 'bg-[#0B1B2B] text-white shadow-xs'
              : 'text-[#233B53] hover:text-[#0B1B2B]'
          )}
        >
          Get My Ballpark
        </button>
        <button
          type="button"
          aria-pressed={intent === 'inspection'}
          onClick={() => setIntent('inspection')}
          className={cn(
            'min-h-11 rounded-md px-3.5 py-2.5 text-xs sm:text-sm font-extrabold tracking-[-0.01em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1B2B] tabular-nums',
            intent === 'inspection'
              ? 'bg-[#0B1B2B] text-white shadow-xs'
              : 'text-[#233B53] hover:text-[#0B1B2B]'
          )}
        >
          Book Free 21-Point Inspection
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label={
          intent === 'price'
            ? 'Get my written ballpark estimate'
            : 'Book a free 21-point drone and thermal roof inspection'
        }
        className="mt-6 space-y-4"
      >
        {submitError && (
          <div
            role="alert"
            className="border border-[#B91C1C]/30 bg-[#FEF2F2] p-4 text-xs sm:text-sm text-[#7F1D1D]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#7F1D1D]">Could not submit your request</p>
                <p className="mt-0.5 text-[#7F1D1D]">{submitError}</p>
                <p className="mt-1.5 font-semibold tabular-nums">
                  Or call our Oceanside desk directly at{' '}
                  <a
                    href={PHONE_HREF}
                    className="font-extrabold underline underline-offset-4 text-[#7F1D1D]"
                  >
                    {PHONE_NUMBER}
                  </a>
                  .
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] px-4 py-2 text-xs font-bold text-white shrink-0 cursor-pointer transition-colors disabled:opacity-60"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {touched && missingFields.length > 0 && !submitError && (
          <div
            role="alert"
            className="rounded-lg border border-[#B91C1C]/30 bg-[#FEF2F2] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#7F1D1D]"
          >
            {missingFields.length === 1 && zipCheck.state === 'outside' ? (
              <span>{zipStatusText}</span>
            ) : (
              <span>
                Please enter {missingFields.join(', ')} to continue. Need immediate help? Call{' '}
                <a
                  href={PHONE_HREF}
                  className="font-extrabold underline underline-offset-4 tabular-nums"
                >
                  {PHONE_NUMBER}
                </a>
                .
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HeroDropdown
            id={`${id}-service`}
            label="Service"
            placeholder="Choose a service"
            defaultIcon="house"
            value={service}
            options={BALLPARK_SERVICES}
            invalid={touched && !service}
            cellClassName="field lead__field-dd"
            variant="field"
            onChange={(val) => setService(val)}
          />

          <HeroDropdown
            id={`${id}-size`}
            label="Home Size"
            placeholder="Choose home size"
            defaultIcon="ruler"
            value={size}
            options={HOME_SIZES}
            invalid={touched && !size}
            cellClassName="field lead__field-dd"
            variant="field"
            onChange={(val) => setSize(val)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field">
            <label
              htmlFor={`${id}-name`}
              className="field__label block text-xs font-bold uppercase tracking-[0.04em] text-[#233B53] mb-1.5"
            >
              Full name
            </label>
            <input
              id={`${id}-name`}
              type="text"
              autoComplete="name"
              required
              placeholder="Alex Rivera"
              value={name}
              aria-invalid={touched && !nameOk ? true : undefined}
              onPointerDown={() => setContactTouched(true)}
              onKeyDown={() => setContactTouched(true)}
              onChange={(e) => {
                setContactTouched(true);
                setName(e.target.value);
              }}
              className={cn(
                'input w-full min-h-12 rounded-lg border bg-[#FFFFFF] px-3.5 py-2.5 text-sm font-medium text-[#0B1B2B] placeholder:text-[#4E6478] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#0F5C8C]',
                touched && !nameOk ? 'border-[#C92D20]' : 'border-[#0B1B2B]/22'
              )}
            />
          </div>

          <div className="field">
            <label
              htmlFor={`${id}-phone`}
              className="field__label block text-xs font-bold uppercase tracking-[0.04em] text-[#233B53] mb-1.5"
            >
              Phone
            </label>
            <input
              id={`${id}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="(760) 555-0134"
              value={phone}
              aria-invalid={touched && !phoneOk ? true : undefined}
              onPointerDown={() => setContactTouched(true)}
              onKeyDown={() => setContactTouched(true)}
              onChange={(e) => {
                setContactTouched(true);
                setPhone(formatPhone(e.target.value));
              }}
              className={cn(
                'input w-full min-h-12 rounded-lg border bg-[#FFFFFF] px-3.5 py-2.5 text-sm font-medium text-[#0B1B2B] placeholder:text-[#4E6478] tabular-nums focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#0F5C8C]',
                touched && !phoneOk ? 'border-[#C92D20]' : 'border-[#0B1B2B]/22'
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field">
            <label
              htmlFor={`${id}-zip`}
              className="field__label block text-xs font-bold uppercase tracking-[0.04em] text-[#233B53] mb-1.5"
            >
              ZIP code
            </label>
            <input
              id={`${id}-zip`}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={10}
              required
              placeholder="92054"
              value={zip}
              aria-invalid={touched && !zipOk ? true : undefined}
              aria-describedby={`${id}-zip-status`}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              className={cn(
                'input w-full min-h-12 rounded-lg border bg-[#FFFFFF] px-3.5 py-2.5 text-sm font-medium text-[#0B1B2B] placeholder:text-[#4E6478] tabular-nums focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#0F5C8C]',
                touched && !zipOk ? 'border-[#C92D20]' : 'border-[#0B1B2B]/22'
              )}
            />
          </div>

          <div className="field">
            <label
              htmlFor={`${id}-email`}
              className="field__label block text-xs font-bold uppercase tracking-[0.04em] text-[#233B53] mb-1.5"
            >
              Email (optional)
            </label>
            <input
              id={`${id}-email`}
              type="email"
              autoComplete="email"
              placeholder="alex@example.com"
              value={email}
              aria-invalid={touched && !emailOk ? true : undefined}
              onPointerDown={() => setContactTouched(true)}
              onKeyDown={() => setContactTouched(true)}
              onChange={(e) => {
                setContactTouched(true);
                setEmail(e.target.value);
              }}
              className={cn(
                'input w-full min-h-12 rounded-lg border bg-[#FFFFFF] px-3.5 py-2.5 text-sm font-medium text-[#0B1B2B] placeholder:text-[#4E6478] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#0F5C8C]',
                touched && !emailOk ? 'border-[#C92D20]' : 'border-[#0B1B2B]/22'
              )}
            />
          </div>
        </div>

        {/* Live ZIP Service-Area Status */}
        <p
          id={`${id}-zip-status`}
          aria-live="polite"
          className={cn(
            'min-h-5 text-xs font-semibold tabular-nums',
            zipCheck.state === 'served'
              ? 'text-[#15803D]'
              : zipCheck.state === 'outside' || zipCheck.state === 'invalid' || (touched && !zipOk)
                ? 'text-[#B91C1C]'
                : 'text-[#3E5871]'
          )}
        >
          {zipStatusText ||
            (touched && !zipOk
              ? 'Enter a 5-digit San Diego County, Temecula, or Murrieta ZIP code.'
              : 'Serving all San Diego County (919xx–921xx), Temecula & Murrieta ZIP codes.')}
        </p>

        {/* Anti-Spam Honeypots */}
        <div
          className="opacity-0 absolute -left-[9999px] h-0 w-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
          tabIndex={-1}
        >
          <label htmlFor={`${id}-fax`}>Business fax</label>
          <input
            id={`${id}-fax`}
            type="text"
            name="business_fax"
            tabIndex={-1}
            autoComplete="off"
            value={honeypotFax}
            onChange={(e) => setHoneypotFax(e.target.value)}
          />
          <label htmlFor={`${id}-web`}>Company website</label>
          <input
            id={`${id}-web`}
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypotWebsite}
            onChange={(e) => setHoneypotWebsite(e.target.value)}
          />
        </div>

        {(contactTouched || Boolean(name.trim() || phone.trim() || email.trim())) && (
          <Turnstile
            key={turnstileKey}
            theme="light"
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
            onError={() => setTurnstileToken('')}
            className="my-1"
          />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex min-h-13 items-center justify-center gap-2.5 rounded-lg bg-[#C92D20] hover:bg-[#AD2317] px-6 py-3.5 text-sm sm:text-base font-extrabold text-white tracking-[-0.01em] transition-colors cursor-pointer shadow-[0_12px_28px_-8px_rgba(201,45,32,0.45)] disabled:opacity-65 tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1B2B]"
        >
          <span>
            {submitting
              ? 'Calculating & Routing Request...'
              : intent === 'inspection'
                ? 'Book My Free 21-Point Inspection'
                : 'Calculate My Ballpark & Request Written Scope'}
          </span>
          <Icon name="arrow-right" className="w-4 h-4 shrink-0" />
        </button>

        <p className="text-xs text-[#3E5871] text-center leading-relaxed">
          No obligation and zero spam. Your details stay strictly with Rise Up Roofing &amp; Construction Inc.
        </p>
      </form>
    </div>
  );
}
