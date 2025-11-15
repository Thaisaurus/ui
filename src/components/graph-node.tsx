import clsx from 'clsx';
import * as m from 'motion/react-m';
import { type Dispatch, type SetStateAction } from 'react';

const colors = {
  green: `hover:bg-green-600 bg-green-500`,
  yellow: `hover:bg-yellow-400 bg-yellow-300`,
};

const GraphNode = ({
  options: { color = `green` } = {},
  position,
  setHoveringNode,
}: {
  options?: { color?: `green` | `yellow` };
  position: { x: number; y: number };
  setHoveringNode: Dispatch<SetStateAction<boolean>>;
}) => (
  <m.div
    animate={{ opacity: 1, y: 0 }}
    className={clsx(
      `absolute z-50 size-8 rounded-full hover:cursor-pointer`,
      colors[color],
    )}
    exit={{
      opacity: 0,
      transition: { delay: Math.random() * 0.8, type: `tween` },
      y: 30,
    }}
    initial={{ opacity: 0, y: 30 }}
    onMouseEnter={() => setHoveringNode(true)}
    onMouseLeave={() => setHoveringNode(false)}
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `translate(-50%, -50%)`,
    }}
    transition={{ delay: Math.random() * 0.8, type: `spring` }}
  />
);
export { GraphNode };
