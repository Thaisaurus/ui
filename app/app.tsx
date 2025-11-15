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

import { Chart } from '@/components/chart';
import { Send } from '@/components/icons';

const sampleQueries = [`A more pleasant word for "smell"`, `Lol`, `wtf`];

const genRandomNodes = (): Node[] =>
  Array.from({ length: 20 }).map((_, i) => {
    const position = { x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 };
    const similarity = 1 - Math.hypot(position.x - 50, position.y - 50) / 100;
    console.log(position, similarity);
    return {
      id: Math.floor(Math.random() * 100_000),
      position,
      similarity,
      variant: i < 10 ? `antonym` : `synonym`,
      word: `haha`,
    };
  });

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
    setNodes([]);
    setQuery(``);
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
      <Chart nodes={nodes} queryWord={queryWord} theWord={theWord} />
      <div className='fixed bottom-0 right-1/2 flex -translate-y-12 translate-x-1/2 flex-col justify-center gap-1.5'>
        <div className='flex h-3 items-center justify-center'>
          <AnimatePresence onExitComplete={() => setThinkingDone(true)}>
            {querying && (
              <m.span
                animate={{ opacity: 1, transition: { type: `spring` }, y: 0 }}
                className='text-foreground/80 -z-50 text-center text-lg'
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
              className='bg-border/20 text-foreground outline-border/20 placeholder:text-muted-foreground max-sm:w-2xs md:w-xl min-w-0 rounded-full border pb-3.5 pl-6 pr-16 pt-4 font-sans text-xl backdrop-blur-sm transition-colors focus:border focus:outline-none'
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
              className='bg-border/20 flex flex-col gap-2 rounded-lg border p-2 backdrop-blur-sm'
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
                      `outline-border data-active-item:bg-border/40 data-active-item:outline rounded-md px-2 py-2 font-sans outline-none`,
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
            className='bg-foreground hover:bg-foreground/90 data-[disabled=true]:bg-foreground/80 absolute right-0 inline-flex aspect-square h-[calc(100%-24px)] -translate-x-[calc(50%-6px)] items-center justify-center rounded-full transition-colors duration-500 hover:cursor-pointer disabled:cursor-auto'
            data-disabled={!thinkingDone || querying}
            disabled={querying || !thinkingDone}
            onClick={() => {
              submitQuery();
            }}
          >
            <Send className='text-background size-3/5 -rotate-90' />
          </button>
        </div>
        <div className='flex h-7 gap-2 px-4'>
          <AnimatePresence mode='popLayout'>
            {selectedTags.map((tag) => (
              <motion.button
                animate={{ opacity: 1, transition: { type: `spring` }, x: 0 }}
                className='hover:border-destructive/80 hover:bg-destructive/20 rounded-full border px-4 font-sans font-medium backdrop-blur-sm transition-colors duration-200 hover:cursor-pointer'
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
