import clsx from 'clsx';
import * as m from 'motion/react-m';
import { type Dispatch, type SetStateAction, useState } from 'react';

const colors = {
  green: `hover:bg-green-600 bg-green-500`,
  red: `hover:bg-red-600 bg-red-500`,
  yellow: `hover:bg-yellow-400 bg-yellow-300`,
};

const GraphNode = ({
  options: { color = `green` } = {},
  position,
  randomDelay = true,
  setHoveringNode,
}: {
  options?: { color?: keyof typeof colors };
  position: { x: number; y: number };
  randomDelay?: boolean;
  setHoveringNode: Dispatch<SetStateAction<boolean>>;
}) => {
  const [_open, _setOpen] = useState(false);

  return (
    <m.div
      animate={{ opacity: 1, x: `-50%`, y: `-50%` }}
      className={clsx(
        `absolute z-50 size-8 rounded-full hover:cursor-pointer transition-colors duration-200`,
        colors[color],
      )}
      exit={{
        opacity: 0,
        transition: {
          delay: randomDelay ? Math.random() * 0.8 : 0.2,
          ease: `easeInOut`,
          type: `tween`,
        },
        y: 30,
      }}
      initial={{ opacity: 0, x: `-50%`, y: 30 }}
      onMouseEnter={() => setHoveringNode(true)}
      onMouseLeave={() => setHoveringNode(false)}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      transition={{ delay: Math.random() * 0.8, type: `spring` }}
    />
  );
};
export { GraphNode };
