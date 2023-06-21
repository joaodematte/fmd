'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';

interface IconButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children?: React.ReactNode;
  tooltip?: string;
  variant: 'primary' | 'subtle';
}

export default function Button({ children, tooltip, disabled, className, variant, onClick }: IconButtonProps) {
  const classes = {
    primary: clsx(
      'rounded-md p-2 text-stone-100 bg-stone-900',
      disabled ? 'cursor-not-allowed opacity-50' : 'focus:outline-black hover:bg-stone-800 focus:bg-stone-800',
      className
    ),
    subtle: clsx(
      'rounded-md p-2 text-stone-900 bg-transparent border-zinc-200/50 border-[1px]',
      disabled ? 'cursor-not-allowed opacity-50' : 'focus:outline-black hover:bg-stone-50 focus:bg-stone-50',
      className
    )
  }[variant];

  if (!Boolean(tooltip) || disabled)
    return (
      <button className={classes} onClick={onClick}>
        {children}
      </button>
    );

  return (
    <Tooltip.Provider delayDuration={500}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className={classes} onClick={onClick}>
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="overflow-hidden rounded-md bg-stone-900 px-2 py-0.5 text-sm text-white opacity-95">
            <Tooltip.Arrow className="opacity-95" />
            <span className="text-xs">{tooltip}</span>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
