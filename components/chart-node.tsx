import {
  Popover,
  PopoverAnchor,
  PopoverDescription,
  PopoverHeading,
  PopoverProvider,
} from '@ariakit/react';
import clsx from 'clsx';
import {
  AnimatePresence,
  motion,
  useIsPresent,
  type Variants,
} from 'motion/react';
import { useMemo, useRef, useState } from 'react';

import type { Node } from '@/lib/types';

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      duration: 0.4,
      type: `spring`,
    },
  },
} satisfies Variants;

const MotionPopover = motion.create(Popover);

const ChartNode = ({
  node: { color, phrase, pos, position, similarity, wordClass = `synonym` },
  randomDelay = true,
  submitQuery,
}: {
  minimumSimilarity: number;
  node: Omit<Node, `id`>;
  randomDelay?: boolean;
  submitQuery: (_: string) => void;
}) => {
  const isPresent = useIsPresent();

  const portalRef = useRef(null);
  const { x, y } = position;

  const initialDelay = useMemo(() => Math.random() * 0.8, []);

  const exitDelay = randomDelay ? Math.random() * 0.8 : 0.2;
  const [hover, setHover] = useState(false);
  const [popoverHover, setPopoverHover] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [hasToggled, setHasToggled] = useState(false);

  const isPopoverOpen =
    isPresent && (toggle || (!hasToggled && (hover || popoverHover)));

  return (
    <div
      className='absolute'
      onMouseLeave={() => {
        setHasToggled(false);
      }}
      ref={portalRef}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <PopoverProvider placement='top'>
        <PopoverAnchor>
          <motion.button
            animate={{
              borderColor:
                isPopoverOpen ?
                  `var(--color-${wordClass}-hover)`
                : `var(--color-${wordClass})`,
              opacity: 1,
              scale: isPresent && !isPopoverOpen ? 1 : 1.2,
              transition: {
                borderColor: { delay: 0, duration: 0.2 },
                delay: initialDelay,
                scale: { delay: 0, duration: 0.2 },
                type: `spring`,
              },
              x: `-50%`,
              y: `-50%`,
            }}
            className={clsx(
              `border-6 absolute z-40 size-8 rounded-full bg-[#171718] hover:cursor-pointer`,
            )}
            exit={{
              opacity: 0,
              transition: {
                delay: exitDelay,
                ease: `easeInOut`,
                type: `tween`,
              },
              y: 30,
            }}
            initial={{ opacity: 0, x: `-50%`, y: 30 }}
            onClick={() => {
              setToggle((cur) => !cur);
              setHasToggled(true);
            }}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            transition={{ type: `spring` }}
          />
          {wordClass !== `search` && (
            <AnimatePresence>
              {isPresent && !isPopoverOpen && (
                <motion.span
                  animate={{
                    opacity: 1,
                    transition: { delay: initialDelay },
                  }}
                  className='bg-border/20 absolute left-1/2 top-1/2 z-30 mt-6 w-auto max-w-md -translate-x-1/2 rounded-md border px-2 pt-1 text-center backdrop-blur-md'
                  exit={{ opacity: 0, scale: 0.8, y: -5 }}
                  initial={{
                    opacity: 0,
                  }}
                  key={phrase.content}
                  style={{ color: `oklch(${color.l} ${color.c} ${color.h})` }}
                >
                  {phrase.content}
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </PopoverAnchor>
        <AnimatePresence>
          {isPopoverOpen && (
            <MotionPopover
              animate={isPopoverOpen ? `open` : `closed`}
              autoFocusOnShow={false}
              className='bg-border/20 z-50 flex origin-bottom flex-col gap-2 rounded-md border px-3 py-3 outline-none backdrop-blur-3xl'
              exit='closed'
              flip={false}
              gutter={28}
              hideOnInteractOutside={false}
              initial='closed'
              onMouseEnter={() => setPopoverHover(true)}
              onMouseLeave={() => setPopoverHover(false)}
              open={isPopoverOpen}
              slide={false}
              variants={menu}
            >
              <PopoverHeading className='text-md wrap-break-word flex max-w-sm flex-col font-medium'>
                <span className='text-2xl'>{phrase.content}</span>
                {phrase.definition && (
                  <span className='max-w-sm'>{phrase.definition}</span>
                )}
              </PopoverHeading>
              <span>
                <hr className='border-t outline-none' />
              </span>
              <PopoverDescription className='flex max-w-sm flex-col gap-1'>
                <span>Similarity Score</span>
                <span
                  className='inset-0 text-2xl'
                  style={{ color: `oklch(${color.l} ${color.c} ${color.h})` }}
                >
                  {similarity.toFixed(3)}
                </span>
                <span>Class</span>
                <span className='inset-0 text-2xl'>{wordClass}</span>
                <span>Part of Speech</span>
                <span className='inset-0 text-2xl'>{pos}</span>
              </PopoverDescription>

              {wordClass !== `search` && (
                <button
                  className='bg-border/60 hover:bg-border/40 rounded-md border px-4 py-2 transition-colors hover:cursor-pointer'
                  onClick={() => submitQuery(phrase.content)}
                >
                  Search
                </button>
              )}
            </MotionPopover>
          )}
        </AnimatePresence>
      </PopoverProvider>
    </div>
  );
};

export { ChartNode };
