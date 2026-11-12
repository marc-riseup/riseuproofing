'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/shared/Icon';
import { clsx as cn } from 'clsx';
import { PHONE_HREF } from '@/lib/utils';

export function StickyCTA() {
  const pathname = usePathname();

  // Suppress on admin and customer portal routes
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/proposal') ||
    pathname?.startsWith('/inspection') ||
    pathname?.startsWith('/warranty')
  ) {
    return null;
  }

  const isHome = pathname === '/';
  const isServices = pathname?.startsWith('/services') ?? false;
  const isReviews = pathname === '/reviews';
  const isContact = pathname === '/contact';

  const handleEstimateClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const estimator = document.getElementById('hero-estimator');
      if (estimator) {
        estimator.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 380, behavior: reduced ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none select-none"
    >
      <div className="pointer-events-auto max-w-[430px] mx-auto bg-[#0B1B2B]/96 border border-white/16 rounded-[24px] shadow-[0_16px_40px_-8px_rgba(11,27,43,0.6)] px-2 py-1.5 flex items-center justify-between gap-1">
        {/* Tab 1: Home */}
        <Link
          href="/"
          prefetch={false}
          className={cn(
            'flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-[16px] transition-colors',
            isHome ? 'bg-white/10 text-[#FFFFFF]' : 'text-[#C8DDF0] hover:text-[#FFFFFF]'
          )}
        >
          <Icon
            name="home"
            className={cn('w-5 h-5', isHome ? 'text-[#2F9FE3]' : 'text-[#C8DDF0]')}
          />
          <span
            className={cn(
              'text-xs mt-1 leading-none',
              isHome ? 'font-bold text-[#FFFFFF]' : 'font-medium text-[#C8DDF0]'
            )}
          >
            Home
          </span>
        </Link>

        {/* Tab 2: Services */}
        <Link
          href="/services"
          prefetch={false}
          className={cn(
            'flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-[16px] transition-colors',
            isServices ? 'bg-white/10 text-[#FFFFFF]' : 'text-[#C8DDF0] hover:text-[#FFFFFF]'
          )}
        >
          <Icon
            name="wrench"
            className={cn('w-5 h-5', isServices ? 'text-[#2F9FE3]' : 'text-[#C8DDF0]')}
          />
          <span
            className={cn(
              'text-xs mt-1 leading-none',
              isServices ? 'font-bold text-[#FFFFFF]' : 'font-medium text-[#C8DDF0]'
            )}
          >
            Services
          </span>
        </Link>

        {/* Tab 3: Reviews */}
        <Link
          href="/reviews"
          prefetch={false}
          className={cn(
            'flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-[16px] transition-colors',
            isReviews ? 'bg-white/10 text-[#FFFFFF]' : 'text-[#C8DDF0] hover:text-[#FFFFFF]'
          )}
        >
          <Icon
            name="star"
            className={cn(
              'w-5 h-5',
              isReviews ? 'fill-[#2F9FE3] text-[#2F9FE3]' : 'text-[#C8DDF0]'
            )}
          />
          <span
            className={cn(
              'text-xs mt-1 leading-none',
              isReviews ? 'font-bold text-[#FFFFFF]' : 'font-medium text-[#C8DDF0]'
            )}
          >
            Reviews
          </span>
        </Link>

        {/* Tab 4: Direct Call */}
        <a
          href={PHONE_HREF}
          aria-label="Call Rise Up Roofing"
          className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-[16px] text-[#10B981] hover:bg-white/[0.06] transition-colors"
        >
          <Icon name="phone" className="w-5 h-5 text-[#10B981]" />
          <span className="text-xs mt-1 leading-none font-bold text-[#10B981]">Call</span>
        </a>

        {/* Tab 5: Signal Crimson Estimate Pill */}
        <Link
          href={isHome ? '#hero-estimator' : '/contact'}
          prefetch={false}
          onClick={handleEstimateClick}
          aria-label="Get Free Estimate"
          className={cn(
            'shrink-0 min-h-[48px] px-3.5 py-2.5 rounded-[16px] bg-[#C92D20] hover:opacity-95 flex items-center gap-1.5 shadow-[0_8px_20px_-6px_rgba(201,45,32,0.5)] transition-opacity',
            isContact && 'ring-2 ring-white/50'
          )}
        >
          <span className="font-[family-name:var(--font-display)] text-xs font-extrabold uppercase tracking-[0.04em] text-[#FFFFFF] whitespace-nowrap">
            Estimate
          </span>
          <Icon name="arrow-right" className="w-3.5 h-3.5 text-[#FFFFFF] shrink-0" />
        </Link>
      </div>
    </nav>
  );
}
