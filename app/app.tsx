import '@/styles/globals.css';
import {
  Combobox,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxPopover,
  ComboboxProvider,
  Hovercard,
  HovercardAnchor,
  HovercardDismiss,
  HovercardProvider,
} from '@ariakit/react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';

import type { Node, Phrase, Tag } from '@/lib/types';

import { Chart } from '@/components/chart';
import { Info } from '@/components/icons';
import { Send } from '@/components/icons';

const sampleQueries = [
  `A more pleasant word for "smell"`,
  `How the sun interacts with windows`,
  `recalcitrant`,
  `oblique`,
];

const tags = [
  { id: 1, name: `Noun`, value: `noun` },
  { id: 3, name: `Adjective`, value: `adjective` },
  { id: 2, name: `Verb`, value: `verb` },
  { id: 4, name: `Adverb`, value: `adverb` },
];

const keybindSuggestion = {
  invisible: {
    opacity: 0,
    y: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Home() {
  const [query, setQuery] = useState(``);
  const [querying, setQuerying] = useState(false);

  const inputRef = useRef(null);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [theWord, setTheWord] = useState<Phrase>({
    content: `thaisaurus`,
    definition: `a book or electronic resource that lists words in groups of synonyms and related concepts.`,
  });

  const [nodes, setNodes] = useState<Node[]>([]);
  const [queryWord, setQueryWord] = useState<string>(theWord.content);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [thinkingDone, setThinkingDone] = useState(true);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  const submitQuery = async (text: string = query) => {
    if (querying || !thinkingDone) return;
    if (text.length === 0) return;
    const params = new URLSearchParams({
      height: window.innerWidth.toString(),
      n: (10).toString(),
      phrase: text,
      width: window.innerWidth.toString(),
    });

    selectedTags.forEach(({ value }) => params.append(`pos`, value));

    setQueryWord(text);
    setNodes([]);

    if (text === query) {
      setQuery(``);
    }

    setQuerying(true);
    setThinkingDone(false);

    const url = `${import.meta.env.VITE_API_URL}?${params.toString()}`;

    if (import.meta.env.DEV) console.log(url);

    const res = await fetch(url, {
      headers: {
        'ngrok-skip-browser-warning': `true`,
      },
      method: `GET`,
    });
    const { results: nodes } = (await res.json()) as { results: Node[] };

    setQuerying(false);
    setNodes(nodes);

    setTheWord(
      nodes
        .filter((node) => node.wordClass === `synonym`)
        .reduce((prev, current) =>
          prev[`similarity`] > current[`similarity`] ? prev : current,
        ).phrase,
    );
  };

  const sampleQuery = useRef(
    sampleQueries[Math.floor(Math.random() * sampleQueries.length)],
  );

  return (
    <>
      <Chart
        nodes={nodes}
        queryWord={queryWord}
        submitQuery={submitQuery}
        thePhrase={theWord}
      />

      <div className='fixed bottom-2 right-1/2 flex flex-1 grow translate-x-1/2 flex-col justify-center gap-1.5 2xl:bottom-6'>
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
        <div className='relative z-50 flex items-center justify-center gap-2 rounded-full transition-all'>
          <motion.span
            animate={
              query.length > 0 && !tagsOpen && thinkingDone && !querying ?
                `visible`
              : `invisible`
            }
            className='text-muted-foreground absolute left-0 top-0 z-50 hidden -translate-y-[calc(100%+2px)] translate-x-6 font-sans text-xs font-semibold md:block'
            exit='invisible'
            initial='invisible'
            variants={keybindSuggestion}
          >
            CTRL+Enter to Submit
          </motion.span>
          <div className='relative flex grow items-center'>
            <ComboboxProvider open={tagsOpen} placement='top'>
              <Combobox
                autoComplete='none'
                autoFocus
                autoSelect
                blurActiveItemOnClick
                className='bg-border/20 text-foreground outline-border/20 placeholder:text-muted-foreground sm:w-xl h-16 w-80 rounded-full border pb-3.5 pl-6 pr-16 pt-4 font-sans text-xl backdrop-blur-sm transition-colors focus:border focus:outline-none'
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

                  const suggestions = tags.filter(
                    (tag) =>
                      tag.name
                        .toLowerCase()
                        .startsWith(lastTag.toLowerCase()) &&
                      !selectedTags.includes(tag),
                  );

                  setFilteredTags(suggestions);
                  setTagsOpen(suggestions.length > 0);
                }}
                onKeyDown={async (e) => {
                  if (e.key === `Enter` && e.ctrlKey) await submitQuery();
                }}
                placeholder={sampleQuery.current}
                ref={inputRef}
                value={query}
              />
              <ComboboxPopover
                className='bg-border/20 z-50 flex flex-col gap-2 rounded-lg border p-2 backdrop-blur-sm'
                finalFocus={inputRef.current}
                gutter={4}
                onClose={() => {
                  setTagsOpen(false);
                }}
                open={tagsOpen}
                sameWidth
                unmountOnHide
              >
                <ComboboxGroup className='flex flex-col gap-2'>
                  <ComboboxGroupLabel className='border-b px-2 py-2 font-sans text-sm font-semibold'>
                    Parts of Speech
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
                          return last === -1 ? curQuery : (
                              curQuery.slice(0, last)
                            );
                        });

                        setSelectedTags((curTags) => [...curTags, tag]);
                      }}
                      value={tag.name}
                    >
                      {tag.name}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxPopover>
              <button
                className='bg-foreground hover:bg-foreground/90 data-[disabled=true]:bg-foreground/80 absolute right-0 inline-flex aspect-square h-[calc(100%-24px)] -translate-x-[calc(50%-6px)] items-center justify-center rounded-full transition-colors duration-500 hover:cursor-pointer disabled:cursor-auto'
                data-disabled={!thinkingDone || querying}
                disabled={querying || !thinkingDone}
                onClick={async () => {
                  await submitQuery();
                }}
              >
                <Send className='text-background size-3/5 -rotate-90' />
              </button>
            </ComboboxProvider>
          </div>

          <div className=''>
            <HovercardProvider defaultOpen placement='top-start' timeout={0}>
              <HovercardAnchor>
                <span className='bg-border/20 hover:bg-border/50 flex size-10 items-center justify-center rounded-full border backdrop-blur-sm'>
                  <Info className='size-4' />
                </span>
              </HovercardAnchor>
              <Hovercard
                className='bg-border/20 flex flex-col gap-2 rounded-md border py-2 backdrop-blur-sm'
                gutter={16}
                slide={false}
              >
                <div className='flex justify-between px-4 pt-0.5'>
                  <h1 className='text-2xl'>Legend</h1>
                  <HovercardDismiss className='' />
                </div>
                <hr className='border-t outline-none' />
                <div className='flex flex-col justify-center gap-3 px-3.5 py-2'>
                  <span className='flex items-center gap-1.5'>
                    <span className='border-6 aspect-square size-8 rounded-full border-[var(--color-synonym)]' />
                    Synonym
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <span className='border-6 aspect-square size-8 rounded-full border-[var(--color-antonym)]' />
                    Antonym
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <span className='border-6 aspect-square size-8 rounded-full border-[var(--color-search)]' />
                    Your search
                  </span>
                </div>
                <hr className='border-t outline-none' />
                <div className='flex flex-col px-3.5'>
                  <span className='text-foreground'>{`Type "@" to filter by parts of speech`}</span>
                </div>
              </Hovercard>
            </HovercardProvider>
          </div>
        </div>
        <div className='flex h-7 gap-2 px-4'>
          <AnimatePresence mode='popLayout'>
            {selectedTags.map((tag) => (
              <motion.button
                animate={{ opacity: 1, transition: { type: `spring` }, x: 0 }}
                className='hover:border-destructive/80 data-[disabled=true]:border-border/80 data-[disabled=true]:text-muted-foreground hover:bg-destructive/20 rounded-full border px-4 font-sans font-medium backdrop-blur-sm transition-colors duration-200 hover:cursor-pointer disabled:hover:cursor-auto data-[disabled=true]:bg-transparent'
                data-disabled={querying || !thinkingDone}
                disabled={querying || !thinkingDone}
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
