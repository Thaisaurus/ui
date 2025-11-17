import clsx from 'clsx';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

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
  // const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const graphRef = useRef<HTMLDivElement>(null);

  const minSimilarity = Math.min(...nodes.map((node) => node.similarity), 100);

  useEffect(() => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    const root = document.querySelector(`#root`);
    root?.scrollTo(graph.clientWidth / 4, graph.clientHeight / 4);

    // const onWheel = (e: WheelEvent) => {
    //   if (!e.ctrlKey) return;
    //   e.preventDefault();
    //   setScale((o) => Math.max(o + e.deltaY * -0.03, 1));
    // };

    // graph.addEventListener(`wheel`, onWheel, { passive: false });
    // return () => graph.removeEventListener(`wheel`, onWheel);
  }, []);

  return (
    <div
      className={clsx(
        `relative flex h-[200vh] w-[200vw] items-center justify-center bg-[url(/bg.svg)] bg-center`,
        isDragging ? `cursor-grabbing` : `cursor-grab`,
      )}
      onPointerDown={(e) => {
        if (e.pointerType !== `mouse`) return;
        setIsDragging(true);
        if (!graphRef.current) return;
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }}
      onPointerLeave={() => setIsDragging(false)}
      onPointerMove={(e) => {
        if (!isDragging) return;
        if (!graphRef.current) return;
        const dx = dragStartRef.current.x - e.clientX;
        const dy = dragStartRef.current.y - e.clientY;
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
        const root = document.querySelector(`#root`);
        root?.scrollTo(root.scrollLeft + dx, root.scrollTop + dy);
      }}
      onPointerUp={() => {
        setIsDragging(false);
      }}
      onWheel={(e) => {
        if (navigator.userAgent.includes(`Mac OS X`)) {
          const root = document.querySelector(`#root`);
          if (!root) return;
          const dxLesser = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
          const dyLesser = Math.abs(e.deltaX) >= Math.abs(e.deltaY);
          root.scrollTo(
            root.scrollLeft + (dxLesser ? e.deltaX : 0),
            root.scrollTop + (dyLesser ? e.deltaY : 0),
          );
        }
      }}
      ref={graphRef}
      // style={{
      //   transform: `scale(${scale * 100}%)`,
      // }}
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
