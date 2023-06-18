'use client';

import * as Tooltip from '@radix-ui/react-tooltip';

interface IconButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children?: React.ReactElement;
  tooltip?: string;
}

const className = 'rounded-md p-2 text-stone-800 hover:bg-white focus:outline-stone-900 focus:bg-white';

export default function IconButton({ children, tooltip, disabled }: IconButtonProps) {
  if (!Boolean(tooltip)) return <button className={className}>{children}</button>;

  return (
    <Tooltip.Provider delayDuration={250} disableHoverableContent={disabled}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className={className}>{children}</button>
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
