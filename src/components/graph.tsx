import clsx from 'clsx';
import { AnimatePresence } from 'motion/react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

import type { Node } from '@/lib/types';

import { GraphNode } from './graph-node';

const Graph = ({
  nodes,
  queryNode,
}: {
  nodes: Array<Node>;
  queryNode?: Node;
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
        `relative flex h-[max(1920px,200vh)] w-[max(1920px,200vw)] items-center justify-center bg-[url(/bg.svg)] bg-center`,
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
      ref={graphRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <AnimatePresence>
        {nodes.map(({ id, position }) => (
          <GraphNode
            key={id}
            position={position}
            setHoveringNode={setHoveringNode}
          />
        ))}
        {queryNode && (
          <GraphNode
            key={queryNode.id}
            options={{ color: `yellow` }}
            position={queryNode.position}
            setHoveringNode={setHoveringNode}
          />
        )}
      </AnimatePresence>
      <div className='size-screen mx-auto grid select-none grid-cols-5 grid-rows-4'>
        <div className='col-start-2 row-start-1'>
          <h1 className='text-6xl md:text-8xl'>Thaisaurus</h1>
          <h2 className='text-foreground/70 text-nowrap text-3xl'>
            a book or electronic resource that lists words in groups <br />
            of synonyms and related concepts.
          </h2>
        </div>
      </div>
    </div>
  );
};

export { Graph };
