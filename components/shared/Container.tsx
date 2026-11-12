import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
  id?: string;
}

export function Container({ children, className, as: Tag = 'div', id }: ContainerProps) {
  return (
    <Tag id={id} className={cn('w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12', className)}>
      {children}
    </Tag>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  alternate?: boolean;
  dark?: boolean;
}

export function Section({
  children,
  className,
  containerClassName,
  id,
  alternate = false,
  dark = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'section-padding relative',
        dark
          ? 'bg-[#0B1B2B] text-white'
          : alternate
            ? 'bg-[#F4F9FC] text-[#0B1B2B]'
            : 'bg-[#FFFFFF] text-[#0B1B2B]',
        className
      )}
    >
      <Container className={cn('relative z-10', containerClassName)}>{children}</Container>
    </section>
  );
}
