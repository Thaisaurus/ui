import '@/styles/globals.css';

import {
  Combobox,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxPopover,
  ComboboxProvider,
} from '@ariakit/react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';

import type { Node } from '@/lib/types';

import { Graph } from '@/components/graph';
import { Send } from '@/components/icons';

const sampleQueries = [`A more pleasant word for "smell"`, `Lol`, `wtf`];

const genRandomNodes = () =>
  Array.from({ length: 10 }).map((_) => ({
    id: Math.floor(Math.random() * 100_000),
    position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    word: `haha`,
  }));

const tags = [
  { id: 1, name: `Sad` },
  { id: 2, name: `Happy` },
  { id: 3, name: `Stupid` },
  { id: 4, name: `Dumb` },
  { id: 5, name: `Goated` },
];

const words = [
  {
    definition: `the quality of smelling strongly of something or of having qualities (especially smells) that make you think of something else:`,
    word: `re·do·lence`,
  },
  {
    definition: `a book or electronic resource that lists words in groups of synonyms and related concepts.\``,
    word: `thai·sau·rus`,
  },
];

const MotionComboboxPopover = m.create(ComboboxPopover);

export default function Home() {
  const [query, setQuery] = useState(``);
  const [querying, setQuerying] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [index, setIndex] = useState(0);

  const toggleIndex = () => {
    setIndex((i) => (i ? 0 : 1));
  };

  const [availableTags, _setAvailableTags] =
    useState<Array<{ id: number; name: string }>>(tags);

  const [selectedTags, setSelectedTags] = useState<
    Array<{ id: number; name: string }>
  >([]);

  const [theWord, setTheWord] = useState({
    definition: `a book or electronic resource that lists words in groups of synonyms and related concepts.`,
    word: `thai·sau·rus`,
  });

  const [nodes, setNodes] = useState<Node[]>([]);
  const [queryWord, setQueryWord] = useState<string>(`thai·sau·rus`);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [thinkingDone, setThinkingDone] = useState(true);
  const [filteredTags, setFilteredTags] = useState<
    { id: number; name: string }[]
  >([]);

  const submitQuery = () => {
    if (querying || !thinkingDone) return;
    if (query.length === 0) return;
    setQueryWord(query);
    setQuery(``);
    setNodes([]);
    setSelectedTags([]);

    setQuerying(true);
    setThinkingDone(false);

    setTimeout(() => {
      setNodes(genRandomNodes());
      toggleIndex();
      setTheWord(words[index]);
      setQuerying(false);
    }, 1000);
  };

  const sampleQuery = useRef(
    sampleQueries[Math.floor(Math.random() * sampleQueries.length)],
  );

  return (
    <>
      <Graph nodes={nodes} queryWord={queryWord} theWord={theWord} />
      <div className='fixed right-1/2 bottom-0 flex translate-x-1/2 -translate-y-12 flex-col justify-center gap-1.5'>
        <div className='flex h-3 items-center justify-center'>
          <AnimatePresence onExitComplete={() => setThinkingDone(true)}>
            {querying && (
              <m.span
                animate={{ opacity: 1, transition: { type: `spring` }, y: 0 }}
                className='-z-50 text-center text-foreground/80'
                exit={{
                  opacity: 0,
                  position: `absolute`,
                  transition: { ease: `easeInOut`, type: `tween` },
                  y: 10,
                }}
                initial={{ opacity: 0, y: -10 }}
                key='thinking'
              >
                Thinking...
              </m.span>
            )}
          </AnimatePresence>
        </div>
        <div className='relative z-50 flex items-center gap-2 rounded-full transition-all'>
          <ComboboxProvider open={tagsOpen} placement='top'>
            <Combobox
              autoComplete='none'
              autoFocus
              autoSelect
              blurActiveItemOnClick
              className='min-w-0 rounded-full border bg-border/20 pt-4 pr-16 pb-3.5 pl-6 font-sans text-xl text-foreground outline-border/20 backdrop-blur-sm transition-colors placeholder:text-muted-foreground focus:border focus:outline-none data-disabled:placeholder:text-muted-foreground/80 max-sm:w-2xs md:w-xl'
              data-disabled={!thinkingDone || querying}
              focusOnMove={false}
              onChange={(e) => {
                const value = e.target.value;

                setQuery(value);

                const lastMarker = value.lastIndexOf(`@`);

                if (lastMarker === -1) {
                  setTagsOpen(false);
                  return;
                }

                const lastTag = value.slice(Math.max(0, lastMarker + 1));

                if (lastTag.includes(` `)) {
                  setTagsOpen(false);
                  return;
                }

                const suggestions = availableTags.filter(
                  (tag) =>
                    tag.name.toLowerCase().startsWith(lastTag.toLowerCase()) &&
                    !selectedTags.includes(tag),
                );

                setFilteredTags(suggestions);
                setTagsOpen(suggestions.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === `Enter` && e.altKey) submitQuery();
              }}
              placeholder={sampleQuery.current}
              ref={inputRef}
              value={query}
            />
            <MotionComboboxPopover
              animate={{ opacity: 1 }}
              className='flex flex-col gap-2 rounded-lg border bg-border/20 p-2 backdrop-blur-sm'
              finalFocus={inputRef.current}
              gutter={4}
              initial={{ opacity: 0 }}
              onClose={() => {
                setTagsOpen(false);
              }}
              open={tagsOpen}
              sameWidth
              unmountOnHide
            >
              <ComboboxGroup className='flex flex-col gap-2'>
                <ComboboxGroupLabel className='border-b px-2 py-2 font-sans text-sm font-semibold'>
                  Tags
                </ComboboxGroupLabel>
                {filteredTags.map((tag) => (
                  <ComboboxItem
                    autoFocus
                    className={clsx(
                      `rounded-md px-2 py-2 font-sans outline-border outline-none data-active-item:bg-border/40 data-active-item:outline`,
                    )}
                    clickOnSpace={false}
                    hideOnClick
                    key={tag.id}
                    onClick={() => {
                      if (!tagsOpen) return;
                      setQuery((curQuery) => {
                        const last = curQuery.lastIndexOf(`@`);
                        return last === -1 ? curQuery : curQuery.slice(0, last);
                      });

                      setSelectedTags((curTags) => [...curTags, tag]);
                    }}
                    value={tag.name}
                  >
                    {tag.name}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </MotionComboboxPopover>
          </ComboboxProvider>

          <button
            className='absolute right-0 inline-flex aspect-square h-[calc(100%-24px)] -translate-x-[calc(50%-6px)] items-center justify-center rounded-full bg-foreground transition-colors hover:cursor-pointer hover:bg-foreground/90 data-disabled:bg-foreground/80'
            data-disabled={!thinkingDone || querying}
            disabled={querying || !thinkingDone}
            onClick={() => {
              submitQuery();
            }}
          >
            <Send className='size-3/5 -rotate-90 text-background' />
          </button>
        </div>
        <div className='flex h-7 gap-2 px-4'>
          <AnimatePresence mode='popLayout'>
            {selectedTags.map((tag) => (
              <motion.button
                animate={{ opacity: 1, transition: { type: `spring` }, x: 0 }}
                className='rounded-full border px-4 font-sans font-medium backdrop-blur-sm transition-colors duration-200 hover:cursor-pointer hover:border-destructive/80 hover:bg-destructive/20'
                exit={{
                  opacity: 0,
                  transition: {
                    ease: `easeInOut`,
                    type: `tween`,
                  },
                  y: 10,
                }}
                initial={{ opacity: 0, x: 10 }}
                key={tag.id}
                layout
                onClick={() => {
                  setSelectedTags((curTags) =>
                    curTags.filter((cmp) => cmp.id !== tag.id),
                  );
                }}
              >
                {tag.name}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
