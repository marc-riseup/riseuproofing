'use client';

import type { BallparkServiceId } from '@/lib/ballpark';
import { clsx as cn } from 'clsx';

interface ServiceBallparkButtonProps {
  service: BallparkServiceId;
  label?: string;
  variant?: 'primary' | 'outline';
  className?: string;
}

export function ServiceBallparkButton({
  service,
  label = 'Get 10-Sec Ballpark',
  variant = 'primary',
  className,
}: ServiceBallparkButtonProps) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent('riseup:ballpark', {
        detail: { service },
      })
    );

    // HeroBallparkBar scrolls #hero-estimator into view on 'riseup:ballpark'; fallback only if absent.
    if (!document.getElementById('hero-estimator')) {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold tracking-[-0.01em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1B2B]',
        variant === 'primary'
          ? 'bg-[#C92D20] text-white hover:bg-[#AD2317] shadow-[0_8px_20px_-6px_rgba(201,45,32,0.35)]'
          : 'border border-[#0B1B2B]/22 bg-white text-[#0B1B2B] hover:border-[#0B1B2B] hover:bg-[#F4F9FC]',
        className
      )}
    >
      <span>{label}</span>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M3.5 8h9m0 0L8.75 4.25M12.5 8l-3.75 3.75"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
