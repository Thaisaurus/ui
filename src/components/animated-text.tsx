import { AnimatePresence, motion } from 'motion/react';

const AnimatedText = ({
  children,
  delay = 0,
  delayFactor = 0.01,
  position,
}: {
  children: string;
  delay?: number;
  delayFactor?: number;
  position: number;
}) => (
  <AnimatePresence mode='popLayout'>
    {children.split(``).map((character, i) => (
      <motion.span
        animate={{ opacity: 1, x: 0 }}
        className='overflow-x-clip relative w-min h-min'
        exit={{ opacity: 0, x: -position }}
        initial={{ opacity: 0, x: position }}
        key={`${character}-${i}`}
        layout
        transition={{
          delay: (children.length - 1 - i) * delayFactor + delay,
          duration: 1,
          type: `spring`,
        }}
      >
        <span className='invisible select-none'>
          {character === ` ` ?
            <>&nbsp;</>
          : character}
        </span>
        <span className='flex items-center justify-center visible absolute inset-0'>
          {character}
        </span>
      </motion.span>
    ))}
  </AnimatePresence>
);

export { AnimatedText };
