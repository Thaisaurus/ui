import clsx from 'clsx';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

import type { Node, Phrase } from '@/lib/types';

import { AnimatedText } from '@/components/animated-text';
import { ChartNode } from '@/components/chart-node';

const Chart = ({
  nodes,
  queryWord,
  submitQuery,
  thePhrase,
}: {
  nodes: Array<Node>;
  queryWord: string;
  submitQuery: (_: string) => void;
  thePhrase: Phrase;
}) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const graphRef = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const minSimilarity = Math.min(...nodes.map((node) => node.similarity), 100);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(globalThis.innerWidth);
      setWindowHeight(globalThis.innerHeight);
    };

    handleResize();

    globalThis.addEventListener(`resize`, handleResize);

    return () => {
      globalThis.removeEventListener(`resize`, handleResize);
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
        `relative flex h-[200vh] w-[200vw] items-center justify-center bg-[url(/bg.svg)] bg-center`,
        isDragging ? `cursor-grabbing` : `cursor-grab`,
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
      <AnimatePresence>
        {nodes.map((node) => (
          <ChartNode
            key={`${node.id}-${node.position.x}-${node.position.y}`}
            minimumSimilarity={minSimilarity}
            node={node}
            submitQuery={submitQuery}
          />
        ))}
      </AnimatePresence>
      <AnimatePresence mode='wait'>
        <ChartNode
          key={queryWord}
          minimumSimilarity={minSimilarity}
          node={{
            color: { c: 0.233, h: 130.85, l: 0.768 },
            phrase: { content: queryWord, definition: `` },
            position: {
              x: 50,
              y: 50,
            },
            similarity: 1,
            wordClass: `search`,
          }}
          randomDelay={false}
          submitQuery={() => {}}
        />
      </AnimatePresence>
      <div className='mx-auto flex h-screen w-screen select-none grid-cols-6 grid-rows-4 flex-col flex-wrap px-8 py-12 md:grid lg:grid-cols-12'>
        <div className='col-span-4 row-start-2 md:col-start-2 lg:col-start-3'>
          <h3 className='ml-1 flex text-6xl text-lime-500 md:text-4xl'>
            synonym
          </h3>
          <h1 className='flex text-6xl md:text-8xl'>
            <AnimatedText position={50}>{thePhrase.content}</AnimatedText>
          </h1>
          <AnimatePresence mode='wait'>
            <motion.h2
              animate={{ opacity: 1 }}
              className='text-foreground/70 text-3xl'
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={thePhrase.content}
            >
              {thePhrase.definition}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export { Chart };
