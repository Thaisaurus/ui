import clsx from 'clsx';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

import type { Node } from '@/lib/types';

import { AnimatedText } from '@/components/animated-text';
import { GraphNode } from '@/components/graph-node';

const Graph = ({
  nodes,
  queryWord,
  theWord,
}: {
  nodes: Array<Node>;
  queryWord: string;
  theWord: { definition: string; word: string };
}) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveringNode, setHoveringNode] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const graphRef = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(globalThis.innerWidth);
      setWindowHeight(globalThis.innerHeight);
    };

    handleResize();

    document.addEventListener(`resize`, handleResize);

    return () => {
      document.removeEventListener(`resize`, handleResize);
    };
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;
    setPosition({
      x: -graphRef.current.clientWidth / 2 + windowWidth / 2,
      y: -graphRef.current.clientHeight / 2 + windowHeight / 2,
    });
  }, [windowHeight, windowWidth]);

  return (
    <div
      className={clsx(
        `relative flex h-[200vh] w-[200vw] items-center justify-center bg-[url(/bg.svg)] bg-center xl:h-[2933.333333px] md:xl:w-[5133.333333333px]`,
        !hoveringNode && (isDragging ? `cursor-grabbing` : `cursor-grab`),
      )}
      onMouseDown={(e: MouseEvent) => {
        setIsDragging(true);
        dragStartRef.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        };
      }}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={(e: MouseEvent) => {
        if (!isDragging) return;
        if (!graphRef.current) return;
        setPosition({
          x: Math.max(
            Math.min(0, e.clientX - dragStartRef.current.x),
            -graphRef.current?.clientWidth + windowWidth,
          ),
          y: Math.max(
            Math.min(0, e.clientY - dragStartRef.current.y),
            -graphRef.current?.clientHeight + windowHeight,
          ),
        });
      }}
      onMouseUp={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={(e) => {
        if (!isDragging) return;
        if (!graphRef.current) return;
        setPosition({
          x: Math.max(
            Math.min(0, e.touches[0].clientX - dragStartRef.current.x),
            -graphRef.current?.clientWidth + windowWidth,
          ),
          y: Math.max(
            Math.min(0, e.touches[0].clientY - dragStartRef.current.y),
            -graphRef.current?.clientHeight + windowHeight,
          ),
        });
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        dragStartRef.current = {
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        };
      }}
      ref={graphRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {nodes.map(({ id, position }) => (
        <AnimatePresence key={id} mode='wait'>
          <GraphNode
            key={id}
            position={position}
            setHoveringNode={setHoveringNode}
          />
        </AnimatePresence>
      ))}
      <AnimatePresence mode='wait'>
        <GraphNode
          key={queryWord}
          options={{ color: `red` }}
          position={{ x: 50, y: 50 }}
          randomDelay={false}
          setHoveringNode={setHoveringNode}
        />
      </AnimatePresence>
      <div className='mx-auto flex h-screen w-screen grid-cols-6 grid-rows-4 flex-col flex-wrap px-8 py-12 select-none md:grid lg:grid-cols-12'>
        <div className='col-span-4 row-start-2 md:col-start-2 lg:col-start-3'>
          <h1 className='flex text-6xl md:text-8xl'>
            <AnimatedText position={50}>{theWord.word}</AnimatedText>
          </h1>
          <AnimatePresence mode='wait'>
            <motion.h2
              animate={{ opacity: 1 }}
              className='text-3xl text-foreground/70'
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={theWord.word}
            >
              {theWord.definition}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export { Graph };
