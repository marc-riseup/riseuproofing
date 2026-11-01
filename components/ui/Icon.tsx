export type IconName =
  | 'chevron'
  | 'phone'
  | 'arrow'
  | 'check'
  | 'star'
  | 'prev'
  | 'next'
  | 'external'
  | 'house'
  | 'tile'
  | 'layers'
  | 'wrench'
  | 'building'
  | 'sun'
  | 'hardhat'
  | 'ruler'
  | 'pin'
  | 'size-sm'
  | 'size-md'
  | 'size-lg'
  | 'size-xl';

const PATHS: Record<IconName, React.ReactNode> = {
  chevron: <path d="M6 9l6 6 6-6" />,
  phone: (
    <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />
  ),
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  star: <path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />,
  prev: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  external: <path d="M14 4h6v6m0-6L11 13M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  house: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v11h14V9" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  tile: (
    <>
      <path d="M3 5.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M3 11.75a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M3 18a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    </>
  ),
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
  ),
  building: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 13h2M14 13h2M8 17h2M14 17h2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  hardhat: (
    <>
      <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
      <path d="M14 6a6 6 0 0 1 6 6v3" />
      <path d="M4 15v-3a6 6 0 0 1 6-6" />
      <rect x="2" y="15" width="20" height="4" rx="1" />
    </>
  ),
  ruler: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <path d="M6 7v4M10 7v3M14 7v4M18 7v3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  'size-sm': (
    <>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6.5 10.2V19h11v-8.8" />
      <path d="M10.5 19v-4.5h3V19" />
    </>
  ),
  'size-md': (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v11h14V9" />
      <path d="M8 20v-5.5h3.5V20" />
      <rect x="13.5" y="11.5" width="3" height="3" rx="0.5" />
    </>
  ),
  'size-lg': (
    <>
      <path d="M2 11 9.5 4.5 17 11" />
      <path d="M4 9.5V20h11V9.5" />
      <path d="M15 12l3.5-3 3.5 3" />
      <path d="M15 10.8V20h5.5v-9.2" />
      <path d="M8 20v-5h3v5" />
    </>
  ),
  'size-xl': (
    <>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 8.2V20h14V8.2" />
      <path d="M5 13.5h14" />
      <path d="M8.5 9.5h2M13.5 9.5h2" />
      <path d="M10.5 20v-4.2h3V20" />
    </>
  ),
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const filled = name === 'star';
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Submit button with label → spinner → drawn check. */
export function SubmitButton({
  state,
  children,
  className = '',
  red = true,
}: {
  state: 'idle' | 'loading' | 'done';
  children: React.ReactNode;
  className?: string;
  red?: boolean;
}) {
  return (
    <button
      type="submit"
      className={`btn ${red ? '' : 'btn--navy'} ${className}`}
      data-state={state}
      data-red={red ? '' : undefined}
      aria-busy={state === 'loading'}
      disabled={state === 'loading'}
    >
      <span className="btn__label">{children}</span>
      <span className="btn__spin" aria-hidden="true" />
      <svg className="btn__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" />
      </svg>
    </button>
  );
}
