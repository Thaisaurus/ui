import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverDescription,
  PopoverHeading,
  PopoverProvider,
} from '@ariakit/react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { useMemo, useRef, useState } from 'react';

import type { Node } from '@/lib/types';

type OKLCH = { c: number; h: number; l: number };

const colors = {
  antonym: `--color-antonym`,
  search: `--color-search`,
  synonym: `--color-synonym`,
};

const normalize = (a: number, b: number, t: number) => b + (a - b) * t;

// cooked
const parseOklch = (className: string): OKLCH => {
  const rootStyles = getComputedStyle(document.documentElement);

  const oklch = rootStyles
    .getPropertyValue(className)
    .match(/oklch\(([^ ]+) ([^ ]+) ([^ ]+)(?: \/ ([^ ]+))?\)/);

  if (!oklch) return { c: 0, h: 0, l: 0 };

  return {
    c: Number.parseFloat(oklch[2]),
    h: Number.parseFloat(oklch[3]),
    l: Number.parseFloat(oklch[1]),
  };
};

const getOklch = ({
  minimumSimilarity = 0,
  similarity,
  variant,
}: {
  minimumSimilarity?: number;
  similarity: number;
  variant: keyof typeof colors;
}): { hover: string; normal: string } => {
  const from = colors[`search`];
  const to = colors[variant];

  const normSim = (similarity - minimumSimilarity) / (1 - minimumSimilarity);

  const fromNormal = parseOklch(from);
  const fromHover = parseOklch(`${from}-hover`);
  const toNormal = parseOklch(to);
  const toHover = parseOklch(`${to}-hover`);

  return {
    hover: `oklch(${normalize(toHover.l, fromHover.l, normSim)}% ${normalize(toHover.c, fromHover.c, normSim)} ${normalize(toHover.h, fromHover.h, normSim)})`,
    normal: `oklch(${normalize(toNormal.l, fromNormal.l, normSim)}% ${normalize(toNormal.c, fromNormal.c, normSim)} ${normalize(toNormal.h, fromNormal.h, normSim)})`,
  };
};

const ChartNode = ({
  minimumSimilarity,
  node: { position, similarity, variant = `synonym`, word },
  randomDelay = true,
}: {
  minimumSimilarity: number;
  node: Omit<Node, `id`>;
  randomDelay?: boolean;
}) => {
  console.log(`render`);
  const calculatedColors = useMemo(
    () =>
      getOklch({
        minimumSimilarity,
        similarity,
        variant,
      }),
    [similarity, variant, minimumSimilarity],
  );

  const portalRef = useRef(null);
  const { hover: _hoverColor, normal: normalColor } = calculatedColors;
  const { x, y } = position;

  const initialDelay = useMemo(() => Math.random() * 0.8, []);

  const exitDelay = randomDelay ? Math.random() * 0.8 : 0.2;
  const [hover, setHover] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [hasToggled, setHasToggled] = useState(false);

  return (
    <div
      className='absolute'
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
              // backgroundColor:
              //   (
              //     hasToggled ? toggle : toggle || hover
              //   ) ?
              //     hoverColor
              //   : normalColor,
              opacity: 1,
              scale:
                (
                  hasToggled ? toggle : toggle || hover
                ) ?
                  1.2
                : 1,
              transition: {
                backgroundColor: { delay: 0, duration: 0.2 },
                delay: initialDelay,
                scale: { delay: 0, duration: 0.2 },
                type: `spring`,
              },
              x: `-50%`,
              y: `-50%`,
            }}
            className={clsx(
              `border-6 absolute z-40 size-8 rounded-full hover:cursor-pointer`,
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
              setHasToggled(false);
            }}
            style={{
              // backgroundColor: normalColor,
              borderColor: `var(${colors[variant]})`,
            }}
            transition={{ type: `spring` }}
          />
          {!(hasToggled ? toggle : toggle || hover) && (
            <motion.span
              animate={{
                opacity: 1,
                transition: { delay: initialDelay },
              }}
              className='absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-full rounded-full px-2 backdrop-blur-sm'
              exit={{ opacity: 0, scale: 0.8, y: -5 }}
              initial={{
                opacity: 0,
              }}
              key={word}
              style={{ color: normalColor }}
            >
              {word}
            </motion.span>
          )}
        </PopoverAnchor>
        <Popover
          autoFocusOnShow={false}
          className='bg-border/20 z-50 flex flex-col rounded-md border px-4 py-3 outline-none backdrop-blur-3xl'
          gutter={16}
          hideOnInteractOutside={false}
          onClose={(e) => e.preventDefault()}
          open={hasToggled ? toggle : toggle || hover}
          portalElement={portalRef.current}
          unmountOnHide
        >
          <PopoverArrow className='fill-border' size={24} />
          <PopoverHeading className='text-md'>{word}</PopoverHeading>
          <hr className='border-t outline-none' />
          <PopoverDescription className='flex flex-col gap-0'>
            <span>score</span>
            <span className='inset-0 text-2xl'>{similarity.toFixed(3)}</span>
            <span>variant</span>
            <span className='inset-0 text-2xl'>{variant}</span>
          </PopoverDescription>
        </Popover>
      </PopoverProvider>
    </div>
  );
};
export { ChartNode };
