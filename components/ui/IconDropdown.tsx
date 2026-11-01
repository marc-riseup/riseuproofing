'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icon';

export type DropdownOption<T extends string = string> = {
  readonly value: T;
  readonly label: string;
  readonly icon: IconName;
};

interface IconDropdownProps<T extends string> {
  id: string;
  label: string;
  placeholder: string;
  defaultIcon: IconName;
  value: T | '';
  options: ReadonlyArray<DropdownOption<T>>;
  onChange: (value: T) => void;
  invalid?: boolean;
  cellClassName?: string;
  variant?: 'bar' | 'field';
}

const CLOSE_EVENT = 'riseup:dd-open';

export function IconDropdown<T extends string>({
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
}: IconDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dir, setDir] = useState<'up' | 'down'>('down');
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const cellRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optRefs = useRef<Array<HTMLLIElement | null>>([]);
  const typeBufRef = useRef('');
  const typeTimerRef = useRef<number | undefined>(undefined);

  const selectedOption = options.find((o) => o.value === value);
  const activeIcon: IconName = selectedOption ? selectedOption.icon : defaultIcon;

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
    const estMenuHeight = options.length * 48 + 20;
    const headerOffset = 108;

    if (rect) {
      if (window.innerWidth <= 899) {
        setDir('down');
        const bottomOverflow = rect.bottom + estMenuHeight + 20 - window.innerHeight;
        if (bottomOverflow > 0) {
          const maxScroll = Math.max(0, rect.top - headerOffset);
          const scrollDelta = Math.min(bottomOverflow, maxScroll);
          if (scrollDelta > 4) {
            window.scrollBy({ top: scrollDelta, behavior: 'smooth' });
          }
        }
      } else {
        const spaceBelow = window.innerHeight - rect.bottom - 20;
        const spaceAbove = rect.top - headerOffset;
        setDir(spaceBelow < estMenuHeight && spaceAbove > spaceBelow ? 'up' : 'down');
      }
    }

    const selIdx = options.findIndex((o) => o.value === value);
    const nextIdx = selIdx >= 0 ? selIdx : 0;
    setActiveIdx(nextIdx);
    setIsOpen(true);
    syncPill(nextIdx);
  }, [id, options, syncPill, value]);

  useEffect(() => {
    if (isOpen && activeIdx >= 0) {
      syncPill(activeIdx);
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
      const matchIdx = options.findIndex((o) => o.label.toLowerCase().startsWith(typeBufRef.current));
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
            <Icon name={activeIcon} className="ico" />
          </span>

          <span className="est__meta">
            {variant === 'bar' && (
              <span id={labelId} className="field__label est__label">
                {label}
              </span>
            )}
            <span className="est__val-row">
              <span id={valId} className={`est__val ${selectedOption ? '' : 'is-placeholder'}`}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <Icon name="chevron" className="est__chev" />
            </span>
          </span>
        </button>

        <div
          className="est__menu"
          data-open={isOpen || undefined}
          data-dir={dir}
        >
          <span className="est__pill" style={pillStyle} aria-hidden="true" />
          <ul
            ref={listRef}
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
                    <Icon name={opt.icon} className="ico" />
                  </span>
                  <span className="est__opt-label">{opt.label}</span>
                  <span className="est__opt-check" aria-hidden="true">
                    <Icon name="check" />
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
