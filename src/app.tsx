import '@/styles/globals.css';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';

import type { Node } from '@/lib/types';

import { Graph } from '@/components/graph';
import { Info, Send } from '@/components/icons';

const sampleQueries = [`A more pleasant word for "smell"`, `Lol`, `wtf`];

const genRandomNodes = () =>
  Array.from({ length: 10 }).map((_) => ({
    id: Math.floor(Math.random() * 100_000),
    position: { x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 },
    word: `haha`,
  }));

export default function Home() {
  const [query, setQuery] = useState(``);
  const [querying, setQuerying] = useState(false);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [queryNode, setQueryNode] = useState<Node | undefined>();

  const sampleQuery = useRef(
    sampleQueries[Math.floor(Math.random() * sampleQueries.length)],
  );

  return (
    <>
      <Graph nodes={nodes} queryNode={queryNode} />
      <div
        className={`fixed bottom-0 right-1/2 flex -translate-y-12 translate-x-1/2 flex-col justify-center gap-1`}
        onDragStart={() => {}}
      >
        <AnimatePresence>
          {querying && (
            <m.span
              animate={{ opacity: 1, y: 0 }}
              className='text-foreground/80 -z-50 text-center'
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: -10 }}
              key='thinking'
              transition={{ type: `spring` }}
            >
              Thinking...
            </m.span>
          )}
        </AnimatePresence>
        <div className='relative flex z-50 rounded-full backdrop-blur-sm transition-all items-center gap-2'>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (querying) return;

              setNodes([]);

              setQueryNode({ id: 0, position: { x: 50, y: 50 }, word: query });
              setQuerying(true);

              setTimeout(() => {
                setNodes(genRandomNodes());
                setQuerying(false);
              }, 1000);
            }}
          >
            <input
              className={`bg-border/20 outline-border/20 w-md rounded-full border pb-3.5 pl-6 pr-16 pt-4 text-xl focus:border focus:outline-none focus:ring-0`}
              disabled={querying}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={sampleQuery.current}
              value={query}
            />
            <button className='bg-foreground hover:bg-foreground/90 absolute inline-flex aspect-square h-[calc(100%-24px)] -translate-x-[calc(100%+12px)] translate-y-[12px] items-center justify-center rounded-full transition-colors hover:cursor-pointer'>
              <Send className='text-background size-3/5 -rotate-90' />
            </button>
          </form>
          <span className='bg-background rounded-full border inline-flex items-center justify-center aspect-square translate-y-[12px]'>
            <Info />
          </span>
        </div>
      </div>
    </>
  );
}
