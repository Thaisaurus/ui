type Node = {
  color: { c: number; h: number; l: number };
  id: string;
  phrase: Phrase;
  pos?: `adjective` | `adverb` | `noun` | `verb`;
  position: { x: number; y: number }; // 0 < x,y < 100
  similarity: number; // 0 to 1
  wordClass: `antonym` | `search` | `synonym`;
};

type Phrase = {
  content: string;
  definition?: string;
};

type Tag = { id: number; name: string; value: string };

export type { Node, Phrase, Tag };
