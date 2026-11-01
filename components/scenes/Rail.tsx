'use client';

/** Slim progress rail with clickable stops (scenes only). In step mode it shows prev/next too. */
export function Rail({
  label,
  items,
  active,
  onSelect,
  stepMode,
  variant = 'dots',
}: {
  label: string;
  items: string[];
  active: number;
  onSelect: (i: number) => void;
  stepMode: boolean;
  variant?: 'dots' | 'tabs';
}) {
  const n = items.length;
  return (
    <nav className={`rail rail--${variant}`} aria-label={label}>
      <ol className="rail__list" style={{ '--n': n, '--p': active / Math.max(1, n - 1) } as React.CSSProperties}>
        {items.map((it, i) => (
          <li key={it}>
            <button
              type="button"
              className="rail__stop"
              aria-current={i === active ? 'step' : undefined}
              data-done={i < active || undefined}
              onClick={() => onSelect(i)}
            >
              <span className="rail__dot" aria-hidden="true" />
              <span className={variant === 'tabs' ? 'rail__text' : 'sr-only'}>{it}</span>
            </button>
          </li>
        ))}
      </ol>
      {stepMode && (
        <div className="rail__steps">
          <button type="button" className="rail__step" onClick={() => onSelect(Math.max(0, active - 1))} disabled={active === 0}>
            Previous
          </button>
          <button type="button" className="rail__step" onClick={() => onSelect(Math.min(n - 1, active + 1))} disabled={active === n - 1}>
            Next
          </button>
        </div>
      )}
    </nav>
  );
}
