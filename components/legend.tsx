import { Hovercard, HovercardAnchor, HovercardProvider } from '@ariakit/react';

import { Info } from '@/components/icons';

const Legend = () => (
  <div className='fixed bottom-8 right-8 z-50'>
    <HovercardProvider
      defaultOpen
      hideTimeout={250}
      placement='top-start'
      showTimeout={0}
    >
      <HovercardAnchor>
        <span className='bg-border/20 hover:bg-border/50 flex size-24 items-center justify-center rounded-full border backdrop-blur-sm'>
          <Info className='size-8' />
        </span>
      </HovercardAnchor>
      <Hovercard gutter={16} slide={false}>
        <div className='bg-border/20 flex flex-col gap-4 rounded-md border px-4 py-4 backdrop-blur-sm'>
          <div>
            <h1 className='text-2xl'>Legend</h1>
            <hr className='border-t outline-0' />
          </div>
          <ul className='flex flex-col gap-2'>
            <li className='flex items-center gap-2'>
              <span className='border-6 aspect-square size-8 rounded-full border-[var(--color-synonym)]' />
              Synonym
            </li>
            <li className='flex items-center gap-2'>
              <span className='border-6 aspect-square size-8 rounded-full border-[var(--color-antonym)]' />
              Antonym
            </li>
            <li className='flex items-center gap-2'>
              <span className='border-6 aspect-square size-8 rounded-full border-[var(--color-search)]' />
              Your search
            </li>
          </ul>
          <hr className='border-t outline-0' />
          <span className='text-foreground'>{`Type "@" to filter by parts of speech`}</span>
        </div>
      </Hovercard>
    </HovercardProvider>
  </div>
);

export { Legend };
