'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type HeroDropdownIconName =
  | 'house'
  | 'layers'
  | 'shield'
  | 'building'
  | 'sun'
  | 'hammer'
  | 'ruler'
  | 'chevron'
  | 'check';

export type DropdownOption<T extends string = string> = {
  readonly value: T;
  readonly label: string;
  readonly icon: HeroDropdownIconName;
};

export interface HeroDropdownProps<T extends string> {
  id: string;
  label: string;
  placeholder: string;
  defaultIcon: HeroDropdownIconName;
  value: T | '';
  options: ReadonlyArray<DropdownOption<T>>;
  onChange: (value: T) => void;
  invalid?: boolean;
  cellClassName?: string;
  variant?: 'bar' | 'field';
}

const CLOSE_EVENT = 'riseup:dd-open';

function DropdownStrokeIcon({
  name,
  className,
}: {
  name: HeroDropdownIconName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === 'check' ? 2.5 : 1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'house' && (
        <>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.2V20h14V9.2" />
          <path d="M10 20v-5.5h4V20" />
        </>
      )}
      {name === 'layers' && (
        <>
          <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        </>
      )}
      {name === 'shield' && (
        <>
          <path d="M12 2.8 4.5 6v5.7c0 5 3.3 8.8 7.5 10.3 4.2-1.5 7.5-5.3 7.5-10.3V6L12 2.8z" />
          <path d="m9.2 12.2 2 2 3.8-3.8" />
        </>
      )}
      {name === 'building' && (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 13h2M14 13h2M8 17h2M14 17h2" />
        </>
      )}
      {name === 'sun' && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </>
      )}
      {name === 'hammer' && (
        <>
          <path d="m14.5 5.5 4 4" />
          <path d="m13 7-8.7 8.7a2.1 2.1 0 0 0 3 3L16 10" />
          <path d="m16 4 4 4-2.5 2.5-4-4L16 4z" />
          <path d="M11.5 5.5 14 3c1.5-0.3 3.2 0.2 4.3 1.3" />
        </>
      )}
      {name === 'ruler' && (
        <>
          <rect x="2" y="7" width="20" height="10" rx="2" />
          <path d="M6 7v4M10 7v3M14 7v4M18 7v3" />
        </>
      )}
      {name === 'chevron' && <path d="m6 9 6 6 6-6" />}
      {name === 'check' && <path d="M5 12.5 9.2 16.7 19 7" />}
    </svg>
  );
}

export function HeroDropdown<T extends string>({
  id,
  label,
  placeholder,
  defaultIcon,
  value,
  options,
  onChange,
  invalid,
  cellClassName = '',
  variant = 'bar',
}: HeroDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dir, setDir] = useState<'up' | 'down'>('down');
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const cellRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const optRefs = useRef<Array<HTMLLIElement | null>>([]);
  const typeBufRef = useRef('');
  const typeTimerRef = useRef<number | undefined>(undefined);

  const selectedOption = options.find((o) => o.value === value);
  const activeIcon: HeroDropdownIconName = selectedOption ? selectedOption.icon : defaultIcon;

  const labelId = `${id}-label`;
  const valId = `${id}-val`;
  const listId = `${id}-list`;

  const syncPill = useCallback((idx: number) => {
    const optEl = optRefs.current[idx];
    if (!optEl || optEl.offsetHeight === 0) {
      setPillStyle({ opacity: 0 });
      return;
    }
    setPillStyle({
      width: `${optEl.offsetWidth}px`,
      height: `${optEl.offsetHeight}px`,
      transform: `translate3d(${optEl.offsetLeft}px, ${optEl.offsetTop}px, 0)`,
      opacity: 1,
    });
  }, []);

  const closeMenu = useCallback((returnFocus = false) => {
    setIsOpen(false);
    setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    if (returnFocus) {
      btnRef.current?.focus();
    }
  }, []);

  const openMenu = useCallback(() => {
    window.dispatchEvent(new CustomEvent(CLOSE_EVENT, { detail: id }));

    const rect = cellRef.current?.getBoundingClientRect();
    const headerOffset = 112;

    if (rect) {
      if (window.innerWidth <= 899) {
        const bottomClearance = 112;
        const estMenuHeight = Math.min(312, options.length * 48 + 16);
        const bottomOverflow = rect.bottom + estMenuHeight + bottomClearance - window.innerHeight;
        if (bottomOverflow > 0) {
          const maxScroll = Math.max(0, rect.top - headerOffset);
          const scrollDelta = Math.min(bottomOverflow, maxScroll);
          if (scrollDelta > 0) {
            window.scrollBy(0, scrollDelta);
          }
        }
        setDir('down');
      } else {
        const estMenuHeight = Math.min(340, options.length * 48 + 20);
        const spaceBelow = window.innerHeight - rect.bottom - 20;
        const spaceAbove = rect.top - headerOffset;
        if (variant === 'field' && spaceBelow < estMenuHeight) {
          const neededScroll = estMenuHeight - spaceBelow;
          const maxScrollGain = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight - window.scrollY,
          );
          if (
            neededScroll <= 120 &&
            neededScroll <= maxScrollGain &&
            rect.top - neededScroll > headerOffset + 40
          ) {
            window.scrollBy(0, neededScroll);
            setDir('down');
          } else {
            setDir('up');
          }
        } else {
          setDir(spaceBelow < estMenuHeight && spaceAbove > spaceBelow ? 'up' : 'down');
        }
      }
    }

    const selIdx = options.findIndex((o) => o.value === value);
    const nextIdx = selIdx >= 0 ? selIdx : 0;
    setActiveIdx(nextIdx);
    setIsOpen(true);
  }, [id, options, value, variant]);

  useEffect(() => {
    if (isOpen && activeIdx >= 0) {
      syncPill(activeIdx);
      optRefs.current[activeIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx, isOpen, syncPill]);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      if (activeIdx >= 0) syncPill(activeIdx);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIdx, isOpen, syncPill]);

  useEffect(() => {
    const onOtherOpen = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail !== id && isOpen) {
        closeMenu(false);
      }
    };
    window.addEventListener(CLOSE_EVENT, onOtherOpen);
    return () => window.removeEventListener(CLOSE_EVENT, onOtherOpen);
  }, [closeMenu, id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (cellRef.current && !cellRef.current.contains(e.target as Node)) {
        closeMenu(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [closeMenu, isOpen]);

  useEffect(() => {
    return () => {
      window.clearTimeout(typeTimerRef.current);
    };
  }, []);

  const selectOption = (opt: DropdownOption<T>, focusTrigger = false) => {
    onChange(opt.value);
    closeMenu(focusTrigger);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      setActiveIdx((prev) => ((prev < 0 ? 0 : prev) + delta + options.length) % options.length);
    } else if (e.key === 'Home' && isOpen) {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End' && isOpen) {
      e.preventDefault();
      setActiveIdx(options.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        openMenu();
      } else if (activeIdx >= 0 && options[activeIdx]) {
        selectOption(options[activeIdx], true);
      }
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      closeMenu(true);
    } else if (e.key === 'Tab' && isOpen) {
      closeMenu(false);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      typeBufRef.current += e.key.toLowerCase();
      window.clearTimeout(typeTimerRef.current);
      typeTimerRef.current = window.setTimeout(() => {
        typeBufRef.current = '';
      }, 500);
      const matchIdx = options.findIndex((o) =>
        o.label.toLowerCase().startsWith(typeBufRef.current),
      );
      if (matchIdx >= 0) {
        if (isOpen) {
          setActiveIdx(matchIdx);
        } else {
          onChange(options[matchIdx].value);
        }
      }
    }
  };

  const activeOptId = activeIdx >= 0 ? `${id}-opt-${activeIdx}` : undefined;

  return (
    <div
      ref={cellRef}
      className={`${cellClassName} ${isOpen ? 'is-open' : ''} ${invalid ? 'is-missing' : ''}`}
      data-dd-variant={variant}
    >
      {variant === 'field' && (
        <span id={labelId} className="field__label" onClick={() => btnRef.current?.focus()}>
          {label}
        </span>
      )}

      <div className={`est__dd-wrap ${isOpen ? 'is-open' : ''}`}>
        <button
          ref={btnRef}
          id={id}
          type="button"
          role="combobox"
          className={`est__dd est__trigger ${variant === 'field' ? 'est__trigger--field' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${labelId} ${valId}`}
          aria-controls={listId}
          aria-activedescendant={isOpen ? activeOptId : undefined}
          aria-invalid={invalid || undefined}
          onClick={() => (isOpen ? closeMenu(false) : openMenu())}
          onKeyDown={onKeyDown}
        >
          <span className={`est__chip ${selectedOption ? 'is-selected' : ''}`} aria-hidden="true">
            <DropdownStrokeIcon name={activeIcon} className="ico" />
          </span>

          <span className="est__meta">
            {variant === 'bar' && (
              <span id={labelId} className="field__label est__label">
                {label}
              </span>
            )}
            <span className="est__val-row">
              <span
                id={valId}
                className={`est__val ${selectedOption ? '' : 'is-placeholder'}`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <DropdownStrokeIcon name="chevron" className="est__chev" />
            </span>
          </span>
        </button>

        <div className="est__menu" data-open={isOpen || undefined} data-dir={dir}>
          <span className="est__pill" style={pillStyle} aria-hidden="true" />
          <ul
            id={listId}
            className="est__list"
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIdx;
              return (
                <li
                  key={opt.value}
                  ref={(el) => {
                    optRefs.current[idx] = el;
                  }}
                  id={`${id}-opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`est__opt ${isActive ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onPointerEnter={(e) => {
                    if (isOpen && e.pointerType === 'mouse') {
                      setActiveIdx(idx);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectOption(opt, false);
                  }}
                >
                  <span className="est__opt-chip" aria-hidden="true">
                    <DropdownStrokeIcon name={opt.icon} className="ico" />
                  </span>
                  <span className="est__opt-label">{opt.label}</span>
                  <span className="est__opt-check" aria-hidden="true">
                    <DropdownStrokeIcon name="check" />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
